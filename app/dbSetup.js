const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

// To populate the db go to app_alessandro_viol container exec and use command: exec node /usr/src/app/dbSetup.js

const setup = async () => {
	const uri = 'mongodb://mongosrv';
	const client = new MongoClient(uri);
	let db = null;

	await client.connect();
	db = client.db('CashShare');

	const usersCollection = db.collection('users');

	const newUsers = [];

	let hashedPassword = await bcrypt.hash('passwordA', 10);
	let newUser = {
		_id: 'Zuppiero',
		name: 'Alessandro',
		surname: 'Viol',
		password: hashedPassword,
	};
	newUsers.push(newUser);

	hashedPassword = await bcrypt.hash('passwordF', 10);
	newUser = {
		_id: 'FedeAzz',
		name: 'Federica',
		surname: 'Azzalini',
		password: hashedPassword,
	};
	newUsers.push(newUser);

	hashedPassword = await bcrypt.hash('passwordM', 10);
	newUser = {
		_id: 'LG',
		name: 'Marco',
		surname: 'Lo Giudice',
		password: hashedPassword,
	};

	newUsers.push(newUser);
	hashedPassword = await bcrypt.hash('passwordD', 10);
	newUser = {
		_id: 'Dani',
		name: 'Daniel',
		surname: 'Todorov',
		password: hashedPassword,
	};
	newUsers.push(newUser);

	try {
		await usersCollection.insertMany(newUsers);
	} catch (err) {
		if (err.code === 11000) {
			// Duplicate key error code
			console.log('Username already exists: ', err);
		} else {
			console.error('(Internal Server Error) Error inserting user:', err);
		}
	}

	const expensesCollection = db.collection('expenses');

	const newExpenses = [
		{
			total_cost: 34.5,
			description: 'Dinner at the bowling',
			category: 'Food and beverages',
			date: {
				year: 2024,
				month: 6,
				day: 22,
			},
			contributors: [
				{
					user_id: 'Zuppiero',
					quota: 6.0,
				},
				{
					user_id: 'FedeAzz',
					quota: 6.0,
				},
				{
					user_id: 'LG',
					quota: 11.5,
				},
				{
					user_id: 'Dani',
					quota: 11.0,
				},
			],
		},
		{
			total_cost: 26.0,
			description: 'Bowling game',
			category: 'Entertainment',
			date: {
				year: 2024,
				month: 6,
				day: 22,
			},
			contributors: [
				{
					user_id: 'FedeAzz',
					quota: 6.5,
				},
				{
					user_id: 'Zuppiero',
					quota: 6.5,
				},
				{
					user_id: 'LG',
					quota: 6.5,
				},
				{
					user_id: 'Dani',
					quota: 6.5,
				},
			],
		},
		{
			total_cost: 26.0,
			description: 'Bowling game',
			category: 'Entertainment',
			date: {
				year: 2024,
				month: 6,
				day: 22,
			},
			contributors: [
				{
					user_id: 'LG',
					quota: 6.5,
				},
				{
					user_id: 'FedeAzz',
					quota: 6.5,
				},
				{
					user_id: 'Zuppiero',
					quota: 6.5,
				},
				{
					user_id: 'Dani',
					quota: 6.5,
				},
			],
		},
		{
			total_cost: 14.0,
			description: 'Aperipiada',
			category: 'Food and beverages',
			date: {
				year: 2024,
				month: 5,
				day: 29,
			},
			contributors: [
				{
					user_id: 'LG',
					quota: 7.0,
				},
				{
					user_id: 'Zuppiero',
					quota: 7.0,
				},
			],
		},
		{
			total_cost: 14.0,
			description: 'Christmas dinner',
			category: 'Food and beverages',
			date: {
				year: 2023,
				month: 12,
				day: 20,
			},
			contributors: [
				{
					user_id: 'FedeAzz',
					quota: 7.0,
				},
				{
					user_id: 'Zuppiero',
					quota: 7.0,
				},
			],
		},
	];

	try {
		await expensesCollection.insertMany(newExpenses);
	} catch (err) {
		if (err.code === 11000) {
			// Duplicate key error code
			console.log('Expense already exists, ', err);
		} else {
			console.error('(Internal Server Error) Error inserting expense:', err);
		}
	}

	expensesCollection.createIndex({ 'contributors.user_id': 1 });

	client.close();
};

setup();
