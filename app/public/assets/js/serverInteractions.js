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

export async function apiEditExpense(expense, router) {
	expense.date.month -= 2;
	console.log('Adding expense :', expense);
	const response = await fetch(`/api/budget/${expense.date.year}/${expense.date.month}/${expense._id}`, {
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
