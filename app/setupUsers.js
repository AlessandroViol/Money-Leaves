const bcrypt = require('bcryptjs');

const setupUsers = async (db) => {
	console.log('Setting up database');

	await db.collection('users').drop();

	// User validation schema
	const userSchema = {
		$jsonSchema: {
			title: 'User validation',
			bsonType: 'object',
			additionalProperties: false,
			required: ['_id', 'name', 'surname', 'password'],
			properties: {
				_id: {
					bsonType: 'string',
					minLength: 2,
					maxLength: 20,
					pattern: '^\\S+$',
					description: 'must be a string without whitespaces, have length between 2 and 20, and is required',
				},
				name: {
					bsonType: 'string',
					minLength: 2,
					maxLength: 20,
					pattern: '^[a-zA-Z ]+$',
					description: 'must be a string, have length between 2 and 20 characters, and is required',
				},
				surname: {
					bsonType: 'string',
					minLength: 2,
					maxLength: 20,
					pattern: '^[a-zA-Z ]+$',
					description: 'must be a string, have length between 2 and 20 characters, and is required',
				},
				password: {
					bsonType: 'string',
					pattern: '^\\$2[aby]\\$[0-9]{2}\\$[./A-Za-z0-9]{53}$',
					description: 'must be a bcrypt hash and is required',
				},
			},
		},
	};

	await db.createCollection('users', {
		validator: userSchema,
	});

	console.log('Users collection created with validation');

	const usersCollection = await db.collection('users');

	const newUsers = [];

	let hashedPassword = (await bcrypt.hash('passwordA', 10)).toString();
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
		console.log('Users populated');
	} catch (err) {
		if (err.code === 11000) {
			console.log('Username already exists: ', err);
		} else if (err.code === 121) {
			console.log('Validation error: ', JSON.stringify(err, null, 2));
		} else {
			console.error('(Internal Server Error) Error inserting user:', err);
		}
	}
};

module.exports = setupUsers;
