const Dashboard = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div
							class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
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
							<h4 class="fs-2 fw-bolder text-primary">{{ this.balance.toFixed(2) }} €</h4>
						</div>
						<h2 class="mb-2">Expenses</h2>
						<canvas class="mb-4 w-100" id="myChart" width="900" height="380"></canvas>

						<h3>Expense list</h3>
						<div class="table-responsive small">
							<header class="d-flex text-start" style="padding-left:1.25rem; padding-right:2.5rem;">
								<span class="col-sm text-truncate w-25 mx-1">Date</span>
								<span class="col-sm-6 text-truncate w-25 mx-1">Category</span>
								<span class="col-sm text-truncate w-25 mx-1">Total</span>
								<span class="col-sm text-truncate w-25 mx-1">Quota</span>
							</header>
							<hr />
							<div class="accordion pb-5" id="accordionExpenses">
								<expense v-for="(expense, index) in this.expenses" :expense="expense" :username="this.username" :index="index" @delete="this.confirmDelete">
								</expense>
							</div>
						</div>
					</section>
				</div>
			</div>
		</section>

		<div class="modal fade" id="deleteConfirm" tabindex="-1" aria-labelledby="deleteConfirmLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="deleteConfirmLabel">Delete expense</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						Are you sure you want to delete this expense?
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary mx-auto" @click='deleteExpense'>Yes</button>
						<button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
  `,

	data: function () {
		return {
			username: '',
			name: '',
			surname: '',
			expenses: [],
			selectedExpense: {},
			balance: 0,
			myChart: null,
		};
	},

	methods: {
		updateData() {
			this.getBalance();
			this.drawLinePlot();
		},

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

		async deleteExpense() {
			const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirm'));
			modal.hide();
			const response = await fetch(
				`/api/budget/${this.selectedExpense.date.year}/${this.selectedExpense.date.month}/${this.selectedExpense._id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.status === 403) {
				console.error('403 Forbidden: user not authenticated'); ///////////////////////////////////////////////not trueeee
				this.goToSignin();
				return;
			}

			if (response.ok) {
				this.expenses = this.expenses.filter((expense) => expense._id !== this.selectedExpense._id);
				console.log('Deleted. New expenses: ', this.expenses);
				this.selectedExpense = {};
			}

			const res = await response.json();
			console.log(res);
			this.updateData();
		},

		confirmDelete(expense) {
			console.log(expense);
			this.selectedExpense = expense;
			const modal = new bootstrap.Modal(document.getElementById('deleteConfirm'));
			modal.show();
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
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

		drawLinePlot() {
			if (this.myChart) {
				this.myChart.destroy();
			}

			const data = {
				labels: this.expenses.map(
					(expense) => expense.date.day.toString() + '/' + expense.date.month.toString() + '/' + expense.date.year.toString()
				),
				datasets: [
					{
						data: this.expenses.map((expense) => expense.total_cost),
						lineTension: 0,
						backgroundColor: 'transparent',
						borderColor: '#28a745',
						borderWidth: 4,
						pointBackgroundColor: '#28a745',
					},
				],
			};

			const options = {
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						boxPadding: 3,
					},
				},
			};

			const ctx = document.getElementById('myChart');
			this.myChart = new Chart(ctx, {
				type: 'line',
				data,
				options,
			});
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
