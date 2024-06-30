const bcrypt = require('bcryptjs');
const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://mongosrv';
const app = express();

const client = new MongoClient(uri);
let db = null;

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded());
app.use(
	session({
		secret: 'segreto',
		resave: false,
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

`app.post('/api/auth/signup', async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const newUser = {
		_id: req.body._id.trim(),
		name: req.body.name.trim(),
		surname: req.body.name.trim(),
		password: hashedPassword,
	};

	const errorInfo = { isUsernameAlreadyTanken: false, errorString: '' };

	if (!validator({ str: req.body.password, allowWhiteSpaces: false, minLength: 6, maxLength: 20, minNumber: 2 })) {
		console.error('Invalid password');
		errorInfo.isInvalidPassword = true;
		errorInfo.errorString = errorInfo.errorString + 'Invalid password' + ', ';
	} else {
		errorInfo.isInvalidPassword = false;
	}

	if (!validator({ str: newUser._id, allowWhiteSpaces: false, minLength: 2, maxLength: 20 })) {
		console.error('Invalid username');
		errorInfo.isUsernameInvalid = true;
		errorInfo.errorString = errorInfo.errorString + 'Invalid username' + ', ';
	} else {
		errorInfo.isUsernameInvalid = false;
	}

	if (!validator({ str: newUser.name, minLength: 2, maxLength: 20, allowNumbers: false, allowSymbols: false })) {
		console.error('Invalid name');
		errorInfo.isNameInvalid = true;
		errorInfo.errorString = errorInfo.errorString + 'Invalid name' + ', ';
	} else {
		errorInfo.isNameInvalid = false;
	}

	if (!validator({ str: newUser.surname, minLength: 2, maxLength: 20, allowNumbers: false, allowSymbols: false })) {
		console.error('Invalid surname');
		errorInfo.isSurnameInvalid = true;
		errorInfo.errorString = errorInfo.errorString + 'Invalid surname' + ', ';
	} else {
		errorInfo.isSurnameInvalid = false;
	}

	if (errorInfo.errorString.length !== 0) {
		return res.status(400).json({ error: errorInfo });
	}

	try {
		await db.collection('users').insertOne(newUser);
		res.json(newUser);
	} catch (err) {
		if (err.code === 11000) {
			errorInfo.isUsernameAlreadyTanken = true;
			errorInfo.errorString = 'Username is already tanken';
			res.status(400).json({ error: errorInfo });
		} else {
			console.error('Error inserting user:', err);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
});`;

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

	if (!validator({ str: req.body.password, allowWhiteSpaces: false, minLength: 6, maxLength: 20, minNumber: 2 })) {
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
	const user = await db.collection('users').findOne({ _id: req.body._id });

	if (user === null) {
		res.status(403).send('Not authenticated!');
		console.log('Not logged in ', req.body._id);
	} else {
		const isValid = await bcrypt.compare(req.body.password, user.password);
		if (isValid) {
			req.session.user = { _id: user._id };
			//res.redirect('/api/restricted');

			console.log('Logged in ', user._id);
			res.json(req.session.user);
		} else {
			res.status(403).send('Not authenticated!');
			console.log('Not logged in ', user._id);
		}
	}
});

function verifyUser(req, res, next) {
	if (req.session.user) {
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

	const expenses = await db.collection('expenses').find(filter).toArray();
	res.json(expenses);
});

// Shows the expense that matches the query
app.get('/api/budget/search', verifyUser, async (req, res) => {
	const user_id = req.session.user._id; // Assuming the user ID is stored in the session
	const query = req.query.q;

	if (!query) {
		return res.status(400).json({ error: 'Query not provided' });
	}

	try {
		const searchRegex = new RegExp(query, 'i'); // 'i' for case-insensitive
		const filter = {
			$or: [{ description: searchRegex }, { category: searchRegex }, { 'contributors.user_id': searchRegex }],
		};

		// Include only expenses where the user is a contributor
		filter.contributors = { $elemMatch: { user_id: user_id } };

		const expenses = await db.collection('expenses').find(filter).toArray();

		res.json(expenses);
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// If authenticated, shows the informations about the user
app.get('/api/budget/whoami', verifyUser, async (req, res) => {
	const user = await db.collection('users').findOne({ _id: req.session.user._id });
	const whoami = {
		username: user._id,
		name: user.name,
		surname: user.surname,
	};

	res.json(whoami);
});

// View logged user's budget in a certain year
app.get('/api/budget/:year', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const year = parseInt(req.params.year);
	console.log(`Viewing budget of ${_id} in ${year}`);

	const filter = {
		'date.year': parseInt(year),
		contributors: { $elemMatch: { user_id: _id } },
	};

	const expenses = await db.collection('expenses').find(filter).toArray();
	res.json(expenses);
});

// View logged user's budget in a certain year and month
app.get('/api/budget/:year/:month', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	console.log(`Viewing budget of ${_id} in ${month}/${year}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		contributors: { $elemMatch: { user_id: _id } },
	};

	const expenses = await db.collection('expenses').find(filter).toArray();
	res.json(expenses);
});

// View the details of an expense made by the user
app.get('/api/budget/:year/:month/:id', verifyUser, async (req, res) => {
	const user_id = req.session.user._id;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const expense_id = req.params.id;

	console.log(`Viewing details of: ${expense_id}`);

	const filter = {
		'date.year': year,
		'date.month': month,
		contributors: { $elemMatch: { user_id: user_id } },
	};

	const expenses = await db.collection('expenses').find(filter).toArray();

	const expense = expenses.find((expense) => expense._id.equals(expense_id));

	res.json(expense);
});

// Create a new expense
app.post('/api/budget/:year/:month', verifyUser, async (req, res) => {
	const total_cost = parseInt(req.body.total_cost);
	const description = req.body.description;
	const category = req.body.category;
	const year = parseInt(req.params.year);
	const month = parseInt(req.params.month);
	const day = new Date().getDate();
	const contributors = req.body.contributors;

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

	const createdExpense = await db.collection('expenses').insertOne(newExpense);
	res.json(createdExpense);
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

	pipeline.push({
		$match: {
			contributors: { $elemMatch: { user_id: _id } },
		},
	});

	pipeline.push({
		$unwind: {
			path: '$contributors',
		},
	});

	pipeline.push({
		$match: {
			'contributors.user_id': _id,
		},
	});

	pipeline.push({
		$group: {
			_id: '$contributors.user_id',
			balance: { $sum: '$contributors.quota' },
		},
	});

	const aggregationResult = await db.collection('expenses').aggregate(pipeline).toArray();
	console.log('Prova aggregazione', aggregationResult);
	res.json(aggregationResult);
});

// View the logged user's balance wrt the user with the specified username
app.get('/api/balance/:id', verifyUser, async (req, res) => {
	const _id = req.session.user._id;
	const other_id = req.params.id;
	console.log(`Viewing balance between ${_id} and ${other_id}`);

	const pipeline = [];

	pipeline.push({
		$match: {
			contributors: { $elemMatch: { user_id: _id, user_id: other_id } },
		},
	});

	pipeline.push({
		$unwind: {
			path: '$contributors',
		},
	});

	pipeline.push({
		$match: {
			$or: [{ 'contributors.user_id': _id }, { 'contributors.user_id': other_id }],
		},
	});

	pipeline.push({
		$group: {
			_id: '$contributors.user_id',
			balance: { $sum: '$contributors.quota' },
		},
	});

	const aggregationResult = await db.collection('expenses').aggregate(pipeline).toArray();
	console.log('Prova aggregazione', aggregationResult);
	res.json(aggregationResult);
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

app.listen(3000, async () => {
	await client.connect();
	db = client.db('CashShare');

	const users = await db.collection('users').find().toArray();
	console.log('All users: ', users);

	const expenses = await db.collection('expenses').find().toArray();
	console.log('All expenses: ', expenses);
});
