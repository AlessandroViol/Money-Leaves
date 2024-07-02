const Dashboard = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
				<div class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white d-flex align-items-center">
					<span class="material-symbols-outlined text-primary me-2">
						temp_preferences_eco
					</span>
					Money Leaves
				</div>

				<ul class="navbar-nav flex-row d-md-none">
					<li class="nav-item text-nowrap">
						<button
							class="nav-link px-3 text-white"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSearch"
							aria-controls="navbarSearch"
							aria-expanded="false"
							aria-label="Toggle search"
						>
							<svg class="bi"><use xlink:href="#search" /></svg>
						</button>
					</li>
					<li class="nav-item text-nowrap">
						<button
							class="nav-link px-3 text-white"
							type="button"
							data-bs-toggle="offcanvas"
							data-bs-target="#sidebarMenu"
							aria-controls="sidebarMenu"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<svg class="bi"><use xlink:href="#list" /></svg>
						</button>
					</li>
				</ul>

				<div id="navbarSearch" class="navbar-search w-100 collapse">
					<input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search" />
				</div>
			</header>

			<div class="container-fluid">
				<div class="row">
					<div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
						<div
							class="offcanvas-md offcanvas-end bg-body-tertiary"
							tabindex="-1"
							id="sidebarMenu"
							aria-labelledby="sidebarMenuLabel"
						>
							<div class="offcanvas-header bg-body">
								<div class="d-flex align-items-center">
									<span class="material-symbols-outlined text-primary me-2 ">
										temp_preferences_eco
									</span>
									<h5 class="offcanvas-title" id="sidebarMenuLabel">
										Money Leaves
									</h5>
								</div>
								
								<button
									type="button"
									class="btn-close"
									data-bs-dismiss="offcanvas"
									data-bs-target="#sidebarMenu"
									aria-label="Close"
								></button>
							</div>
							<div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
								<ul class="nav flex-column">
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="#">
											<svg class="bi"><use xlink:href="#house-fill" /></svg>
											Dashboard
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#file-earmark" /></svg>
											Orders
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#cart" /></svg>
											Products
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#people" /></svg>
											Customers
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#graph-up" /></svg>
											Reports
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#puzzle" /></svg>
											Integrations
										</a>
									</li>
								</ul>

								<h6
									class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase"
								>
									<span>Saved reports</span>
									<a class="link-secondary" href="#" aria-label="Add a new report">
										<svg class="bi"><use xlink:href="#plus-circle" /></svg>
									</a>
								</h6>
								<ul class="nav flex-column mb-auto">
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
											Current month
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
											Last quarter
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
											Social engagement
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#file-earmark-text" /></svg>
											Year-end sale
										</a>
									</li>
								</ul>

								<hr class="my-3" />

								<ul class="nav flex-column mb-auto">
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" href="#">
											<svg class="bi"><use xlink:href="#gear-wide-connected" /></svg>
											Settings
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link d-flex align-items-center gap-2" @click="goToSignin" href="#">
											<svg class="bi"><use xlink:href="#door-closed" /></svg>
											Sign out
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div
							class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
						>
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

						<strong class="strong">Welcome back {{name}}!</strong>

						<canvas class="my-4 w-100" id="myChart" width="900" height="380"></canvas>

						<h2>Expense list</h2>
						<div class="table-responsive small">
							<header class="d-flex text-start" style="padding-left:1.25rem; padding-right:2.5rem;">
								<span class="col-sm text-truncate w-25 mx-1">Date</span>
								<span class="col-sm-6 text-truncate w-25 mx-1">Category</span>
								<span class="col-sm text-truncate w-25 mx-1">Total</span>
								<span class="col-sm text-truncate w-25 mx-1">Quota</span>
							</header>
							<hr />
							<div class="accordion" id="accordionExpenses">
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
			myChart: null,
		};
	},

	methods: {
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
				console.error('403 Forbidden: user not authenticated');
				this.goToSignin();
			}

			if (response.ok) {
				this.expenses = this.expenses.filter((expense) => expense._id !== this.selectedExpense._id);
				console.log('Deleted. New expenses: ', this.expenses);
				this.selectedExpense = {};
			}

			const res = await response.json();
			console.log(res);
			this.drawLinePlot();
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
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				console.error(errorMessage);
				return;
			}

			const res = await response.json();
			console.log(res);
			this.expenses = res;

			this.drawLinePlot();
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
