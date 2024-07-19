const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

const verifyUser = require('./user').verifyUser;
const categories = require('./setupExpenses').categories;

let db = null;

function setDb(database) {
	db = database;
}

// Verify that the date is valid
function isDateValid({ year, month = 1, day = 1 }) {
	const date = new Date();
	const currentYear = date.getFullYear();
	const currentMonth = date.getMonth() + 1;
	const maxDays = new Date(year, month - 1, 0).getDate();
	const currentDay = date.getDate();

	if (year < 2020 || year > currentYear) {
		return false;
	}
	if (month < 1 || month > 12 || (year === currentYear && month > currentMonth)) {
		return false;
	}
	if (day < 1 || day > maxDays || (year === currentYear && month === currentMonth && day > currentDay)) {
		return false;
	}

	return true;
}

// Verify the validity of the expense the user is creating/editing/deleting
async function verifyExpense(req, res, next) {
	const expense = {
		payer_id: req.body.payer_id,
		total_cost: parseFloat(req.body.total_cost),
		description: req.body.description,
		category: req.body.category,
		date: {
			year: parseInt(req.params.year),
			month: parseInt(req.params.month),
			day: parseInt(req.body.date.day),
		},
		contributors: req.body.contributors,
	};

	const user_id = req.session.user._id;

	if (expense.payer_id !== user_id) {
		res.status(403).send('User cannot operate on this expense!');
		console.log('User is not the payer', user_id, expense.payer_id);

		return;
	}

	if (!isDateValid({ year: expense.date.year, month: expense.date.month, day: expense.date.day })) {
		console.log(`Invalid year/month ${expense.date.year}/${expense.date.month}/${expense.date.day}`);
		res.status(400).json({ error: 'Invalid date specified' });

		return;
	}

	if (!categories.includes(expense.category)) {
		console.log(`Invalid category ${expense.category}`);
		res.status(400).json({ error: 'Invalid category specified' });

		return;
	}

	const total_quota = expense.contributors.reduce((sum, contributor) => sum + contributor.quota, 0);

	if (expense.total_cost !== total_quota) {
		console.log(`Invalid quotas, they must sum up to the total cost ${expense.contributors}`);
		res.status(400).json({ error: 'Invalid quotas specified' });

		return;
	}

	const hasZeroQuota = expense.contributors.some((contributor) => contributor.quota === 0);

	if (hasZeroQuota) {
		console.log(`Invalid zero quota ${expense.contributor}`);
		res.status(400).json({ error: 'Invalid zero quota specified' });

		return;
	}

	const hasNegativeQuota = expense.contributors.some((contributor) => contributor.quota < 0);

	if (expense.category === 'Refound') {
		if (expense.total_cost !== 0) {
			console.log(`Invalid total cost ${expense.total_cost}`);
			res.status(400).json({ error: 'Invalid total cost specified' });

			return;
		}

		if (!hasNegativeQuota) {
			console.log(`Invalid quotas, one must be negative ${expense.contributors}`);
			res.status(400).json({ error: 'Invalid quotas specified' });

			return;
		}

		if (expense.contributors.length !== 2) {
			console.log(`Invalid number of contributors, must be two ${expense.contributors.length}`);
			res.status(400).json({ error: 'Invalid number of contributors specified' });

			return;
		}
	} else {
		if (expense.total_cost <= 0) {
			console.log(`Invalid total cost ${expense.total_cost}`);
			res.status(400).json({ error: 'Invalid total cost specified' });

			return;
		}

		if (hasNegativeQuota) {
			console.log(`Invalid quotas, they all must be positive ${expense.contributors}`);
			res.status(400).json({ error: 'Invalid quotas specified' });

			return;
		}
		if (expense.contributors.length <= 1) {
			console.log(`Invalid number of contributors, must be at least two ${expense.contributors.length}`);
			res.status(400).json({ error: 'Invalid number of contributors specified' });

			return;
		}
	}

	const usernames = expense.contributors.map((contributor) => contributor.user_id);

	if (!usernames.includes(expense.payer_id)) {
		console.log(`Invalid contributors specified, payer must be among them ${expense.contributors}`);
		res.status(400).json({ error: 'Invalid contributors specified' });

		return;
	}

	const uniqueUsernames = [...new Set(expense.contributors.map((contributor) => contributor.user_id))];
	console.log(`Unique usernames: ${uniqueUsernames}, found usernames: ${usernames}`);
	if (usernames.length !== uniqueUsernames.length) {
		console.log(`Invalid duplicate contributors specified, contributors should only appear once ${expense.contributors}`);
		res.status(400).json({ error: 'Invalid duplicate contributors specified' });

		return;
	}

	const users = await db
		.collection('users')
		.find({ _id: { $in: usernames } })
		.toArray();
	const actualUsernames = users.map((user) => user._id);

	if (!usernames.every((userId) => actualUsernames.includes(userId))) {
		res.status(400).json({ error: 'Invalid contributors username specified' });

		return;
	}

	next();
}

// View logged user's budget
router.get('/', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	console.log('Viewing budget of ', _id);

	const filter = {
		contributors: { $elemMatch: { user_id: _id } },
	};

	try {
		const expenses = await db.collection('expenses').find(filter).toArray();
		res.json(expenses);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when retrieving the expenses' });
	}
});

// Shows the expense that matches the query
router.get('/search', verifyUser, async (req, res) => {
	const user_id = req.session.user._id;
	const query = req.query.q;

	if (!query) {
		return res.status(400).json({ error: 'Query not provided' });
	}

	try {
		const searchRegex = new RegExp(query, 'i');
		const filter = {
			$or: [{ description: searchRegex }, { category: searchRegex }, { 'contributors.user_id': searchRegex }],
			contributors: { $elemMatch: { user_id: user_id } },
		};

		const expenses = await db.collection('expenses').find(filter).toArray();

		res.json(expenses);
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// If authenticated, shows the informations about the user
router.get('/whoami', verifyUser, async (req, res) => {
	try {
		const user = await db.collection('users').findOne({ _id: req.session.user._id });
		const whoami = {
			username: user._id,
			name: user.name,
			surname: user.surname,
		};

		res.json(whoami);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when retrieving user information' });
	}
});

// View logged user's budget in a certain year
router.get('/:year', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const year = parseInt(req.params.year);

	if (!isDateValid({ year: year })) {
		console.log(`Invalid year ${year}`);
		res.status(400).json({ error: 'Invalid year requested' });
		return;
	}

	console.log(`Viewing budget of ${_id} in ${year}`);

	const filter = {
		'date.year': parseInt(year),
		contributors: { $elemMatch: { user_id: _id } },
	};

	try {
		const expenses = await db.collection('expenses').find(filter).toArray();
		res.json(expenses);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when retrieving the expenses' });
	}
});

// View logged user's budget in a certain year and month
router.get('/:year/:month', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);

	if (!isDateValid({ year: year, month: month })) {
		console.log(`Invalid year/month ${year}/${month}`);
		res.status(400).json({ error: 'Invalid year/month specified' });

		return false;
	}

	console.log(`Viewing budget of ${_id} in ${month}/${year}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		contributors: { $elemMatch: { user_id: _id } },
	};

	try {
		const expenses = await db.collection('expenses').find(filter).toArray();
		res.json(expenses);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when retrieving the expenses' });
	}
});

// View the details of an expense made by the user
router.get('/:year/:month/:id', verifyUser, async (req, res) => {
	const user_id = req.session.user._id;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const expense_id = req.params.id;

	if (!isDateValid({ year: year, month: month })) {
		console.log(`Invalid year/month: ${year}/${month}`);
		res.status(400).json({ error: 'Invalid year/month requested' });
		return;
	}

	console.log(`Viewing details of: ${expense_id}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		contributors: { $elemMatch: { user_id: user_id } },
	};

	try {
		const expenses = await db.collection('expenses').find(filter).toArray();
		const expense = expenses.find((expense) => expense._id.equals(expense_id));

		res.json(expense);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when retrieving the expenses' });
	}
});

// Create a new expense
router.post('/:year/:month', verifyUser, verifyExpense, async (req, res) => {
	const newExpense = {
		payer_id: req.body.payer_id,
		total_cost: parseFloat(req.body.total_cost),
		description: req.body.description,
		category: req.body.category,
		date: {
			year: parseInt(req.params.year),
			month: parseInt(req.params.month),
			day: parseInt(req.body.date.day),
		},
		contributors: req.body.contributors,
	};

	try {
		const createdExpense = await db.collection('expenses').insertOne(newExpense);
		res.json(createdExpense);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when creating the expense' });
	}
});

// Edit an expense
router.put('/:year/:month/:id', verifyUser, verifyExpense, async (req, res) => {
	const user_id = req.session.user._id;

	const expense_id = req.params.id;
	const payer_id = req.body.payer_id;
	const total_cost = parseFloat(req.body.total_cost);
	const description = req.body.description;
	const category = req.body.category;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const day = parseInt(req.body.date.day);
	const contributors = req.body.contributors;

	console.log(`Viewing details of: ${expense_id}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		payer_id: user_id,
	};

	try {
		const expenses = await db.collection('expenses').find(filter).toArray();
		console.log('Compatible expenses: ', expenses);
		const expense = expenses.find((expense) => expense._id.equals(expense_id));
		console.log('Match: ', expense);

		if (expense !== undefined) {
			const editedExpense = {
				$set: { payer_id, total_cost, description, category, date: { ...expense.date, year, month, day }, contributors },
			};

			console.log(`Editing expense ${expense_id}: `, expense);

			const updated = await db.collection('expenses').updateOne({ _id: new ObjectId(expense_id) }, editedExpense);
			console.log('HERE');
			res.json(updated);
		} else {
			res.status(404).json({ error: 'Expense not found' });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'An error occurred when updating the expense' });
	}
});

// Deletes an expense
router.delete('/:year/:month/:id', verifyUser, async (req, res) => {
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const _id = new ObjectId(req.params.id);

	const user_id = req.session.user._id;

	console.log(`Deleting expense: ${_id}`);

	try {
		const expense = await db.collection('expenses').findOne({ _id });

		if (expense === null || expense === undefined) {
			res.status(404).send('Expense not found!');
			console.log('Expense not found', req.params._id);
			return;
		}

		if (expense.payer_id !== user_id) {
			res.status(403).send('User cannot operate on this expense!');
			console.log('User is not the payer', user_id, expense.payer_id);

			return;
		}

		if (year !== expense.date.year || month !== expense.date.month) {
			console.log(`Invalid year/month ${year}/${month}`);
			res.status(400).json({ error: 'Invalid date specified' });

			return;
		} else {
			const deleteResult = await db.collection('expenses').deleteOne({ _id });
			res.json(deleteResult);
		}
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when deleting the expense' });
	}
});

module.exports = { router, setDb };
