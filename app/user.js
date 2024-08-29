const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

let db = null;

function setDb(database) {
	db = database;
}

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
		return;
	}
}

// create new user's credentials
router.post('/signup', async (req, res) => {
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
router.post('/signin', async (req, res) => {
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

// sign out
router.post('/signout', (req, res) => {
	if (req.session.user) {
		req.session.destroy((err) => {
			if (err) {
				console.error('Error destroying session:', err);
				return res.status(500).json({ error: 'Failed to log out' });
			}

			res.clearCookie('connect.sid');
			console.log('Logged out successfully');
			res.status(200).json({ message: 'Logged out successfully' });
		});
	} else {
		res.status(400).json({ error: 'No active session' });
	}
});

module.exports = { router, verifyUser, setDb };
