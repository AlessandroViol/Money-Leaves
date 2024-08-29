const express = require('express');
const session = require('express-session');
const { MongoClient, ObjectId } = require('mongodb');

const setupUsers = require('./setupUsers');
const setupExpenses = require('./setupExpenses').setupExpenses;

const userAPI = require('./user');
const budgetAPI = require('./budget');
const balanceAPI = require('./balance');

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

app.use('/api/auth', userAPI.router);
app.use('/api/budget', budgetAPI.router);
app.use('/api/balance', balanceAPI.router);

const verifyUser = userAPI.verifyUser;

// Searches the user that matches the query
app.get('/api/users/search', verifyUser, async (req, res) => {
	const query = req.query.q;

	if (!query) {
		return res.status(400).json({ error: 'Query not provided' });
	}

	try {
		const searchRegex = new RegExp(query, 'i');
		const filter = {
			$or: [{ _id: searchRegex }, { name: searchRegex }, { surname: searchRegex }],
		};

		const projection = { _id: 1, name: 1, surname: 1 };
		const users = await db.collection('users').find(filter).project(projection).toArray();

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
	console.log('Users loaded: ', users.length);

	const expenses = await db.collection('expenses').find().toArray();
	console.log('Expenses loaded: ', expenses.length);

	userAPI.setDb(db);
	budgetAPI.setDb(db);
	balanceAPI.setDb(db);
});
