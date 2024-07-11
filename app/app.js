const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');

const setupUsers = require('./setupUsers');
const setupExpenses = require('./setupExpenses');

const uri = 'mongodb://mongosrv';
const app = express();

const client = new MongoClient(uri);
let db = null;

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		// Just for the exam, the secret shouldn't be hardcoded
		secret:
			'@ij5#vbE8RQZjHPX8#*^9CS5mXNYfX53QJ2qp%quJzPUgtYJ6aSf$FcMKQ6qg5itt29tyaKr&XDXXd@CpygCr4PgKTX#ym8v5TU4bPXQLyAejKcQtPTV3bRWVC!p4WmC',
		resave: false,
		saveUninitialized: false,
	})
);

//expects trimmed string
function validator({
	str,
	allowWhiteSpaces = true,
	minLength = 0,
	maxLength = 20,
	allowNumbers = true,
	minNumber = 0,
	allowSymbols = true,
}) {
	let result = true;
	console.log('evaluating: ', str);

	// check str contains some letters
	const containsLetter = /[a-zA-Z]/.test(str);
	result = result && containsLetter;

	console.log('contains letter: ', containsLetter);

	// checks for whitespaces
	if (!allowWhiteSpaces) {
		const hasWhiteSpace = /\s/.test(str);
		result = result && !hasWhiteSpace;

		console.log('contains whitespace: ', hasWhiteSpace);
	}

	// checks length in range
	result = result && str.length >= minLength && str.length <= maxLength;
	console.log('Is in length range: ', str.length >= minLength && str.length <= maxLength);

	// checks for numbers
	if (!allowNumbers) {
		const hasNumber = /\d/.test(str);
		result = result && !hasNumber;
		console.log('contains numbers: ', hasNumber);
	}

	// Count the number of numbers in the string
	const count = (str.match(/\d/g) || []).length;
	result = result && count >= minNumber;
	console.log('contains enough numbers: ', count >= minNumber);

	// checks for symbols
	if (!allowSymbols) {
		const hasSymbol = /[^a-zA-Z0-9]/.test(str);
		result = result && !hasSymbol;
		console.log('contains symbols: ', hasSymbol);
	}

	console.log('Final evaluatio: ', result);
	console.log(',######################################\n');
	return result;
}

// create new user's credentials
app.post('/api/auth/signup', async (req, res) => {
	console.log('req', req.body);

	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const newUser = {
		_id: req.body._id.trim(),
		name: req.body.name.trim(),
		surname: req.body.surname.trim(),
		password: hashedPassword,
	};

	if (!validator({ str: req.body.password, allowWhiteSpaces: false, minLength: 6, maxLength: 18, minNumber: 2 })) {
		console.error('Invalid password');
		return res.status(460).json({ error: 'Invalid password' });
	}

	if (!validator({ str: newUser._id, allowWhiteSpaces: false, minLength: 2, maxLength: 20 })) {
		console.error('Invalid username');
		return res.status(461).json({ error: 'Invalid username' });
	}

	if (!validator({ str: newUser.name, minLength: 2, maxLength: 20, allowNumbers: false, allowSymbols: false })) {
		console.error('Invalid name');
		return res.status(462).json({ error: 'Invalid name' });
	}

	if (!validator({ str: newUser.surname, minLength: 2, maxLength: 20, allowNumbers: false, allowSymbols: false })) {
		console.error('Invalid surname');
		return res.status(463).json({ error: 'Invalid surname' });
	}

	try {
		await db.collection('users').insertOne(newUser);
		res.json(newUser);
	} catch (err) {
		if (err.code === 11000) {
			// Duplicate key error code
			res.status(464).json({ error: 'Username already exists' });
		} else {
			console.error('Error inserting user:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
});

// sign in user
app.post('/api/auth/signin', async (req, res) => {
	try {
		const user = await db.collection('users').findOne({ _id: req.body._id });

		if (user === null) {
			res.status(403).send('Not authenticated!');
			console.log('Not logged in ', req.body._id);
		} else {
			const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

			if (isPasswordValid) {
				req.session.user = { _id: user._id };
				//res.redirect('/api/restricted');

				console.log('Logged in ', user._id);
				res.json(req.session.user);
			} else {
				res.status(403).send('Not authenticated!');
				console.log('Not logged in ', user._id);
			}
		}
	} catch (error) {
		res.status(500).json({ error: 'An error occurred during the login' });
	}
});

async function verifyUser(req, res, next) {
	if (req.session.user) {
		const user = await db.collection('users').findOne({ _id: req.session.user._id });

		if (user === null) {
			res.status(403).send('Not authenticated!');
			console.log('Not logged in');
			return;
		}

		next();
	} else {
		res.status(403).send('Not authenticated!');
	}
}

// View logged user's budget
app.get('/api/budget/', verifyUser, async (req, res) => {
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
app.get('/api/budget/search', verifyUser, async (req, res) => {
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
app.get('/api/budget/whoami', verifyUser, async (req, res) => {
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
app.get('/api/budget/:year', verifyUser, async (req, res) => {
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
app.get('/api/budget/:year/:month', verifyUser, async (req, res) => {
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
app.get('/api/budget/:year/:month/:id', verifyUser, async (req, res) => {
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
		console.log('User is not the payer', user_id);

		return false;
	}
}

// Create a new expense
app.post('/api/budget/:year/:month', verifyUser, async (req, res) => {
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

	const newExpense = {
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
		return;
	}

	try {
		const createdExpense = await db.collection('expenses').insertOne(newExpense);
		res.json(createdExpense);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when creating the expense' });
	}
});

// Edit an expense
app.put('/api/budget/:year/:month/:id', verifyUser, async (req, res) => {
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
app.delete('/api/budget/:year/:month/:id', verifyUser, async (req, res) => {
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

// View logged user's balance
app.get('/api/balance', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	console.log('Viewing balance of ', _id);

	const pipeline = [];

	// Select all expenses that involve the user
	pipeline.push({
		$match: {
			contributors: { $elemMatch: { user_id: _id } },
		},
	});

	// For each document and contributor, create a copy of the document. In the copy, the contributors list contains only that contributor
	pipeline.push({
		$unwind: {
			path: '$contributors',
		},
	});

	// Selects all the documents where the user is the contributor or the payer
	pipeline.push({
		$match: {
			'contributors.user_id': _id,
		},
	});

	// Divides the quota and total cost for each divided document into one or more of 6 categories:
	pipeline.push({
		$project: {
			_id: '$contributors.user_id',

			// how much money the user should have spended (sum of quotas)
			expense: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $eq: ['$contributors.user_id', _id] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			// how much money the user payed upfront
			payed: {
				$cond: {
					if: { $eq: ['$contributors.user_id', '$payer_id'] },
					then: '$total_cost',
					else: 0,
				},
			},

			// how much money the user anticipated for the other users
			expectedBack: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $eq: ['$contributors.user_id', '$payer_id'] }] },
					then: { $subtract: ['$total_cost', '$contributors.quota'] },
					else: 0,
				},
			},

			// how much money the other users anticipated for the user
			debt: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $ne: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			// how much money the user returned to other users
			refounded: {
				$cond: {
					if: { $and: [{ $eq: ['$category', 'Refound'] }, { $eq: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			// how much money the user got refounded
			received: {
				$cond: {
					if: { $and: [{ $eq: ['$category', 'Refound'] }, { $ne: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},
		},
	});

	// Sums the values for each category according to the username
	pipeline.push({
		$group: {
			_id: '$_id',
			totalExpense: { $sum: '$expense' },
			payed: { $sum: '$payed' },
			expectedBack: { $sum: '$expectedBack' },
			debt: { $sum: '$debt' },
			refounded: { $sum: '$refounded' },
			received: { $sum: '$received' },
		},
	});

	const aggregationResult = await db.collection('expenses').aggregate(pipeline).toArray();
	console.log('Balance:', aggregationResult);

	let balance = [];
	if (aggregationResult.length > 0) {
		balance = aggregationResult[0];
	} else {
		balance = {
			_id: _id,
			totalExpense: 0,
			payed: 0,
			expectedBack: 0,
			debt: 0,
			refounded: 0,
			received: 0,
		};
	}

	res.json(balance);
});

// View the logged user's balance wrt the user with the specified username
app.get('/api/balance/:id', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const other_id = req.params.id;

	const user = await db.collection('users').findOne({ _id: other_id });

	if (user === null) {
		res.status(403).send('User does not exist');
		console.log('User does not exist ', other_id);
	}

	console.log(`Viewing balance between ${_id} and ${other_id}`);

	const pipeline = [];

	// Select all expenses that involve the user
	pipeline.push({
		$match: {
			$and: [{ contributors: { $elemMatch: { user_id: _id } } }, { contributors: { $elemMatch: { user_id: other_id } } }],
		},
	});

	//select only expenses payed by one of the users
	pipeline.push({
		$match: {
			$or: [{ payer_id: _id }, { payer_id: other_id }],
		},
	});

	// For each document and contributor, create a copy of the document. In the copy, the contributors list contains only that contributor
	pipeline.push({
		$unwind: {
			path: '$contributors',
		},
	});

	// Selects all the documents where one of the users is a contributor
	pipeline.push({
		$match: {
			$or: [{ 'contributors.user_id': _id }, { 'contributors.user_id': other_id }],
		},
	});

	const aggregationTest = await db.collection('expenses').aggregate(pipeline).toArray();
	console.log('API test:', aggregationTest);

	// Divides the quota and total cost for each divided document into one or more of 6 categories:
	pipeline.push({
		$project: {
			_id: '$contributors.user_id',

			expense: {
				$cond: {
					if: { $ne: ['$category', 'Refound'] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			payed: {
				$cond: {
					if: { $eq: ['$contributors.user_id', '$payer_id'] },
					then: '$total_cost',
					else: 0,
				},
			},

			//	expectedBack: can't be computed with this particular pipeline. However, in the balance analysis of two users,
			//                it corresponds to the debt of the other user. After the processing we just need to swap the values

			debt: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $ne: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			refounded: {
				$cond: {
					if: { $and: [{ $eq: ['$category', 'Refound'] }, { $eq: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			received: {
				$cond: {
					if: { $and: [{ $eq: ['$category', 'Refound'] }, { $ne: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},
		},
	});

	// Sums the values for each category according to the username
	pipeline.push({
		$group: {
			_id: '$_id',
			totalExpense: { $sum: '$expense' },
			payed: { $sum: '$payed' },
			debt: { $sum: '$debt' },
			refounded: { $sum: '$refounded' },
			received: { $sum: '$received' },
		},
	});

	const aggregationResults = await db.collection('expenses').aggregate(pipeline).toArray();

	let balance = [];
	if (aggregationResults.length > 0) {
		aggregationResults[0].expectedBack = aggregationResults[1].debt;
		aggregationResults[1].expectedBack = aggregationResults[0].debt;

		balance = aggregationResults;
	} else {
		balance = {
			_id: _id,
			totalExpense: 0,
			payed: 0,
			expectedBack: 0,
			debt: 0,
			refounded: 0,
			received: 0,
		};
	}

	console.log('Balance with friend:', balance);
	res.json(balance);
});

// Searches the user that matches the query
app.get('/api/users/search', verifyUser, async (req, res) => {
	const query = req.query.q;

	if (!query) {
		return res.status(400).json({ error: 'Query not provided' });
	}

	try {
		const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive
		const filter = {
			$or: [{ _id: searchRegex }, { name: searchRegex }, { surname: searchRegex }],
		};

		const users = await db.collection('users').find(filter).toArray();

		res.json(users);
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.get('*', (req, res) => {
	res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(3000, async () => {
	await client.connect();
	db = client.db('money-leaves');

	if (true || (await db.listCollections({ name: 'users' }).toArray()).length === 0) {
		await setupUsers(db);
		await setupExpenses(db);
	}

	const users = await db.collection('users').find().toArray();
	console.log('All users: ', users);

	const expenses = await db.collection('expenses').find().toArray();
	console.log('All expenses: ', expenses);
});
