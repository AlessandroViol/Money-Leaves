const Dashboard = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h1 class="h1">Dashboard</h1>
							
							<div class="btn-toolbar mb-2 mb-md-0">
								<div class="btn-group me-2">
									<button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
									<button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
								</div>
								<button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1">
									<svg class="bi"><use xlink:href="#calendar3" /></svg>
									This week
								</button>
							</div>
							
						</div>
						
						<h2 class="mt-2">Welcome back <span class="text-primary">{{name}}</span>!</h2>

						<div class="my-4">
							<h3>Total Balance</h3>
							<h4 class="fs-2 fw-bolder text-primary">{{ this.balance }} €</h4>
						</div>
						<h2 class="mb-2">Expenses</h2>
						<expense-line-chart :expenses="expenses"></expense-line-chart>

						<h3>Expense list</h3>
						<expense-list :expenses="expenses" :username="username" @update="updateExpenses"></expense-list>
					</section>
				</div>
			</div>
		</section>
  `,

	data: function () {
		return {
			username: '',
			name: '',
			surname: '',
			expenses: [],
			selectedExpense: {},
			balance: 0,
		};
	},

	methods: {
		async getBalance() {
			const response = await fetch('/api/balance/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 403) {
				console.error('403 Forbidden: user not authenticated');
				this.goToSignin();
				return;
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				this.$router.push({ path: `/error/${errorMessage}` });
				console.error(errorMessage);
				return;
			}

			const res = await response.json();
			console.log(res);
			this.balance = res;
		},

		async getExpenses() {
			const response = await fetch('/api/budget/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status === 403) {
				console.error('403 Forbidden: user not authenticated');
				this.goToSignin();
				return;
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				this.$router.push({ path: `/error/${errorMessage}` });
				console.error(errorMessage);
				return;
			}

			const res = await response.json();
			console.log(res);
			this.expenses = res;

			this.updateData();
		},

		async updateExpenses(updatedExpenses) {
			this.expenses = [...updatedExpenses];
			console.log('New expenses:', this.expenses);
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
		},

		updateData() {
			this.getBalance();
		},
	},

	computed: {},

	created: async function () {
		console.log('created');
		const response = await fetch('/api/budget/whoami', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (response.status === 403) {
			console.error('403 Forbidden: user not authenticated');
			this.goToSignin();
			return;
		}

		if (!response.ok) {
			const errorMessage = `Error: ${response.statusText}`;
			this.$router.push({ path: `/error/${errorMessage}` });
			console.error(errorMessage);
			return;
		}

		if (response.ok) {
			const res = await response.json();
			console.log('Displaying dashboard for: ', res.username);

			this.username = res.username;
			this.name = res.name;
			this.surname = res.surname;
		}
	},

	mounted: async function () {
		await this.getExpenses();
	},
};

export default Dashboard;
