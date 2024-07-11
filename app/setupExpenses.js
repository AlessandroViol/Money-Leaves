const fs = require('fs').promises;

const categories = [
	'Refound',
	'Food and beverages',
	'Entertainment',
	'Taxes and bills',
	'Transportation',
	'Travel',
	'Present',
];

const setupExpenses = async (db) => {
	console.log('Setting up database');

	await db.collection('expenses').drop();

	const expensesSchema = {
		$expr: {
			$or: [
				{ $and: [{ $eq: ['$category', 'Refound'] }, { $eq: ['$total_cost', 0] }] },
				{
					$and: [
						{ $ne: ['$category', 'Refound'] },
						{ $sum: '$contributors.quota' },
						{
							$allElementsTrue: {
								$map: { input: '$contributors', as: 'contributor', in: { $gt: ['$$contributor.quota', 0] } },
							},
						},
					],
				},
			],
		},
		$jsonSchema: {
			bsonType: 'object',
			required: ['payer_id', 'total_cost', 'description', 'category', 'date', 'contributors'],
			properties: {
				payer_id: {
					bsonType: 'string',
					minLength: 2,
					maxLength: 20,
					pattern: '^\\S+$',
					description: 'must be a string without whitespaces, have length between 2 and 20, and is required',
				},
				total_cost: {
					bsonType: 'number',
					minimum: 0.0,
					maximum: 2000.0,
					description: 'must be a positive number, lesser than 200, and is required',
				},
				description: {
					bsonType: 'string',
					description: 'must be a string and is required',
				},
				category: {
					bsonType: 'string',
					enum: categories,
					description: 'must be a string and is required',
				},
				date: {
					bsonType: 'object',
					required: ['year', 'month', 'day'],
					properties: {
						year: {
							bsonType: 'int',
							minimum: 2020,
							maximum: 2200,
							description: 'must be an integer between 2020 and the current year and is required',
						},
						month: {
							bsonType: 'int',
							minimum: 1,
							maximum: 12,
							description: 'must be an integer between 1 and 12 and is required',
						},
						day: {
							bsonType: 'int',
							minimum: 1,
							maximum: 31,
							description: 'must be an integer between 1 and 31 and is required',
						},
					},
				},
				contributors: {
					bsonType: 'array',
					minItems: 2,
					items: {
						bsonType: 'object',
						required: ['user_id', 'quota'],
						additionalProperties: false,
						description: "'items' must contain the stated fields.",
						properties: {
							user_id: {
								bsonType: 'string',
								minLength: 2,
								maxLength: 20,
								pattern: '^\\S+$',
								description: 'must be a string without whitespaces, have length between 2 and 20, and is required',
							},
							quota: {
								bsonType: 'number',
								minimum: -2000.0,
								maximum: 2000.0,
								description: 'must be a number between -2000 and 2000 and is required',
							},
						},
					},
					description: 'must be an array of objects with user_id and quota properties and contain at least two contributors',
				},
			},
		},
	};

	await db.createCollection('expenses', {
		validator: expensesSchema,
	});

	const expensesCollection = await db.collection('expenses');

	await expensesCollection.createIndex({ 'contributors.user_id': 1 });
	await expensesCollection.createIndex({ payer_id: 1 });

	console.log('Collection created with validation');

	const data = await fs.readFile(`${__dirname}/expenses.json`, 'utf8');
	const newExpenses = JSON.parse(data);

	try {
		await expensesCollection.insertMany(newExpenses);
		console.log('Expenses populated');
	} catch (err) {
		if (err.code === 11000) {
			console.log('Expense already exists, ', err);
		} else if (err.code === 121) {
			console.log('Validation error: ', JSON.stringify(err, null, 2));
		} else {
			console.error('(Internal Server Error) Error inserting expense:', err);
		}
	}
};

module.exports = { setupExpenses, categories };
