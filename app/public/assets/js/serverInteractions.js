export async function apiWhoAmI(router) {
	const response = await fetch('/api/budget/whoami', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log('Logged user: ', res.username);
	return res;
}

export async function apiGetBalance(router) {
	const response = await fetch('/api/balance/', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(res);
	return res;
}

export async function apiGetBalanceWithUser(otherUsername, router) {
	const response = await fetch(`/api/balance/${otherUsername}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(`Balance with the user ${otherUsername}`, res);

	return res;
}

export async function apiGetExpenses(year, month, router) {
	let apiPath;
	if (!year) {
		apiPath = '/api/budget/';
	} else if (!month) {
		apiPath = `/api/budget/${year}`;
	} else {
		apiPath = `/api/budget/${year}/${month}`;
	}

	const response = await fetch(apiPath, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(res);

	return res;
}

export async function apiCreateExpense(expense, router) {
	const response = await fetch(`/api/budget/${expense.date.year}/${expense.date.month}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(expense),
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log('Created expense', res);

	return res;
}

export async function apiEditExpense(expense, originalDate, router) {
	console.log('Editing expense :', expense);
	const response = await fetch(`/api/budget/${originalDate.year}/${originalDate.month}/${expense._id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(expense),
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(res);
	return res;
}

export async function apiDeleteExpense(expense, router) {
	const response = await fetch(`/api/budget/${expense.date.year}/${expense.date.month}/${expense._id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated'); ///////////////////////////////////////////////not trueeee user may not be the payer
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log('Expenses deleted: ', res.deletedCount);

	return res;
}

export async function apiQueryExpense(query, router) {
	const response = await fetch(`/api/budget/search?q=${query}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(`Found ${res.length} matching expenses for the query ${query}`);

	return res;
}

export async function apiSignUp(username, name, surname, password, router) {
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ _id: username, name, surname, password }),
	});

	if (!response.ok) {
		const res = { status: response.status, errorMessage: `Error: ${response.statusText}` };

		if (response.status < 460 || response.status > 464) {
			router.push({ path: `/error/${res.errorMessage}` });
			console.error(res.errorMessage);

			return;
		} else {
			return res;
		}
	}

	const res = await response.json();
	res.ok = true;
	console.log('Account created', res);
	return res;
}

export async function apiSignIn(username, password, router) {
	const response = await fetch('/api/auth/signin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ _id: username, password }),
	});

	if (response.status === 403) {
		console.error('403 Forbidden: Invalid credentials');
		return { status: 400 };
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		console.error(errorMessage);
		alert(errorMessage);
		return { status: 400 };
	}

	router.push({ path: '/' });

	const res = await response.json();
	console.log(`${res.username} signed in`);
	return { status: 200, res };
}

export async function apiQueryUser(query, router) {
	const response = await fetch(`/api/users/search?q=${query}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (response.status === 403) {
		console.error('403 Forbidden: user not authenticated');
		router.push({ path: `/signin` });
		return;
	}

	if (!response.ok) {
		const errorMessage = `Error: ${response.statusText}`;
		router.push({ path: `/error/${errorMessage}` });
		console.error(errorMessage);
		return;
	}

	const res = await response.json();
	console.log(`Found ${res.length} users`);

	return res;
}
