const express = require('express');
const router = express.Router();
const verifyUser = require('./user').verifyUser;

let db = null;

function setDb(database) {
	db = database;
}

// View logged user's balance
router.get('/', verifyUser, async (req, res) => {
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
			credit: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $eq: ['$contributors.user_id', '$payer_id'] }] },
					then: { $multiply: [{ $subtract: ['$total_cost', '$contributors.quota'] }, -1] },
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
			given: {
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
			totalPayed: { $sum: '$payed' },
			totalCredit: { $sum: '$credit' },
			totalDebt: { $sum: '$debt' },
			totalGiven: { $sum: '$given' },
			totalReceived: { $sum: '$received' },
		},
	});

	try {
		const aggregationResult = await db.collection('expenses').aggregate(pipeline).toArray();
		console.log('Balance query result:', aggregationResult);

		let balance = [];
		if (aggregationResult.length > 0) {
			balance = aggregationResult[0];
			balance.totalExpenditure = balance.totalPayed + balance.totalGiven;
			balance.totalIncome = balance.totalReceived;
			balance.totalMoneySpent = balance.totalPayed + balance.totalGiven + balance.totalReceived;
		} else {
			balance = {
				_id: _id,
				totalExpense: 0,
				totalPayed: 0,
				totalCredit: 0,
				totalDebt: 0,
				totalGiven: 0,
				totalReceived: 0,
				totalExpenditure: 0,
				totalIncome: 0,
				totalMoneySpent: 0,
			};
		}

		res.json(balance);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when computing the balance' });
	}
});

// View the logged user's balance wrt the user with the specified username
router.get('/:id', verifyUser, async (req, res) => {
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

			//	credit: can't be computed with this particular pipeline. However, in the balance analysis of two users,
			//                it corresponds to the debt of the other user. After the processing we just need to swap the values

			debt: {
				$cond: {
					if: { $and: [{ $ne: ['$category', 'Refound'] }, { $ne: ['$contributors.user_id', '$payer_id'] }] },
					then: '$contributors.quota',
					else: 0,
				},
			},

			given: {
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
			totalPayed: { $sum: '$payed' },
			totalDebt: { $sum: '$debt' },
			totalGiven: { $sum: '$given' },
			totalReceived: { $sum: '$received' },
		},
	});

	try {
		const aggregationResults = await db.collection('expenses').aggregate(pipeline).toArray();

		let balance = [];
		if (aggregationResults.length > 0) {
			aggregationResults[0].totalCredit = -aggregationResults[1].totalDebt;
			aggregationResults[1].totalCredit = -aggregationResults[0].totalDebt;

			balance = aggregationResults.filter((obj) => {
				return obj._id === _id;
			})[0];

			balance.totalExpenditure = balance.totalPayed + balance.totalGiven;
			balance.totalIncome = balance.totalReceived;
			balance.totalMoneySpent = balance.totalPayed + balance.totalGiven + balance.totalReceived;
		} else {
			balance = {
				_id: _id,
				totalExpense: 0,
				totalPayed: 0,
				totalCredit: 0,
				totalDebt: 0,
				totalGiven: 0,
				totalReceived: 0,
				totalExpenditure: 0,
				totalIncome: 0,
				totalMoneySpent: 0,
			};
		}

		console.log(`Balance with ${other_id}:`, balance);
		res.json(balance);
	} catch (error) {
		res.status(500).json({ error: 'An error occurred when updating the expense' });
	}
});

module.exports = { router, setDb };
