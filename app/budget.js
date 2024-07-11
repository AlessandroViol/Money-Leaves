const express = require('express');
const router = express.Router();
const verifyUser = require('./user').verifyUser;

let db = null;

function setDb(database) {
	db = database;
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
		res.status(400).json({ error: 'Invalid year/month requested' });
		return;
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

// Verify that the user is the payer the expense he is creating/editing/deleting
function verifyUserExpense(req, res, expense) {
	const user_id = req.session.user._id;

	if (expense.payer_id !== user_id) {
		res.status(403).send('User cannot operate on this expense!');
		console.log('User is not the payer', user_id, expense.payer_id);

		return false;
	}

	return true;
}

// Create a new expense
router.post('/:year/:month', verifyUser, async (req, res) => {
	const payer_id = req.body.payer_id;
	const total_cost = parseInt(req.body.total_cost);
	const description = req.body.description;
	const category = req.body.category;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const day = new Date().getDate();
	const contributors = req.body.contributors;

	if (!isDateValid({ year: year, month: month, day: day })) {
		console.log(`Invalid year/month/day: ${year}/${month}/${day}`);
		res.status(400).json({ error: 'Invalid year/month/day requested' });
		return;
	}

	console.log(`Creating new expense`);

	const newExpense = {
		payer_id,
		total_cost,
		description,
		category,
		date: {
			year,
			month,
			day,
		},
		contributors,
	};

	if (!verifyUserExpense(req, res, newExpense)) {
		console.log(`error`);
		return;
	}

	console.log(`Can create new expense`);

	try {
		const createdExpense = await db.collection('expenses').insertOne(newExpense);
		res.json(createdExpense);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when creating the expense' });
	}
});

// Edit an expense
router.put('/:year/:month/:id', verifyUser, async (req, res) => {
	const user_id = req.session.user._id;
	const total_cost = parseInt(req.body.total_cost);
	const description = req.body.description;
	const category = req.body.category;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const contributors = req.body.contributors;
	const expense_id = req.params.id;

	console.log(`Viewing details of: ${expense_id}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		contributors: { $elemMatch: { user_id: user_id } },
	};

	const expenses = await db.collection('expenses').find(filter).toArray();

	const expense = expenses.find((expense) => expense._id.equals(expense_id));

	if (expense !== undefined) {
		const editedExpense = {
			$set: { total_cost, description, category, date: { ...expense.date, year, month }, contributors },
		};

		console.log(`Editing expense ${expense_id}: `, expense);

		const updated = await db.collection('expenses').updateOne({ _id: new ObjectId(expense_id) }, editedExpense);
		res.json(updated);
	} else {
		res.status(404).json({ error: 'Expense not found' });
	}
});

// Deletes an expense
router.delete('/:year/:month/:id', verifyUser, async (req, res) => {
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const _id = new ObjectId(req.params.id);

	console.log(`Deleting expense: ${_id}`);

	const expense = await db.collection('expenses').findOne({ _id });

	if (expense === null || expense === undefined) {
		res.status(404).send('Expense not found!');
		console.log('Expense not found', req.params._id);
		return;
	}

	if (!verifyUserExpense(req, res, expense)) {
		return;
	}

	let deleteResult = {};
	if (expense.date.year === year && expense.date.month === month) {
		deleteResult = await db.collection('expenses').deleteOne({ _id });
	} else {
		deleteResult.deletedCount = 0;
	}

	res.json(deleteResult);
});

module.exports = { router, setDb };
