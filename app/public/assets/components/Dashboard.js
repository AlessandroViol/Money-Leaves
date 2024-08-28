import { apiGetBalance, apiGetExpenses, apiQueryExpense, apiWhoAmI } from '../js/serverInteractions.js';

const Dashboard = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar :active_page="'dashboard'"></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
							<h1 class="h1 mt-3">Dashboard</h1>
						<h2 class="mt-2">Welcome back <span class="text-primary">{{name}}</span>!</h2>

						<div class="my-4">
							<h3>Balance</h3>
							<hr/>
							<balance :balance="balance"></balance>
						</div>

						<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h2 class="mb-2">Expenses</h2>
							
							<div class="btn-toolbar mb-2 mb-md-0">
								<div class="btn-group me-2">
									<button type="button" class="btn btn-sm btn-outline-secondary" @click="filterExpenses('all')">All</button>
									<button type="button" class="btn btn-sm btn-outline-secondary" @click="filterExpenses('last-month')">Last month</button>
									<button type="button" class="btn btn-sm btn-outline-secondary" @click="filterExpenses('last-year')">Last year</button>
								</div>

								<div class="btn-group">
									<button id="filter-calendar" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1" 
										type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" 
									>
										<svg class="bi">
											<use xlink:href="#calendar3" />
										</svg>
									</button>
									<div class="dropdown-menu dropdown-menu-end py-0 border-0">
										<calendar @updateDate="updateDate">
											<div class="btn-group mx-5 mb-2">
												<button class="btn btn-outline-primary" @click="filterExpenses('date')">Date</button>
												<button class="btn btn-outline-primary" @click="filterExpenses('month')">Month</button>
												<button class="btn btn-outline-primary" @click="filterExpenses('year')">Year</button>
											</div>
										</calendar>
									</div>
								</div>
							</div>
						</div>

						<expense-line-chart :expenses="expenses" :username="username"></expense-line-chart>
						<div class="d-flex justify-content-between">
							<h3>Expense list</h3>
							<div>
								<button
									class="nav-link px-3 text-white"
									type="button"
									data-bs-toggle="collapse"
									data-bs-target="#expenseSearch"
									aria-controls="expenseSearch"
									aria-expanded="false"
									aria-label="Toggle search"
								>
									<svg class="bi align-middle search-icon"><use xlink:href="#search" /></svg>
								</button>
							</div>
						</div>
						<div id="expenseSearch" class="rounded-bottom shadow mb-3 w-100 collapse">
							<input class="py-3 rounded-bottom bg-body-secondary form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search" v-model="query"/>
						</div>
						
						<expense-list :expenses="expenses" :username="username" @updateExpenses="updateExpenses"></expense-list>
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
			balance: {
				totalExpense: 0,
				payed: 0,
				expectedBack: 0,
				debt: 0,
				refounded: 0,
				received: 0,
			},
			selectedDate: {},
			showedDate: {},
			currentFilter: 'all',
			query: '',
		};
	},

	methods: {
		async getBalance() {
			const res = await apiGetBalance(this.$router);

			if (res) {
				this.balance = res;
			}
		},

		sortExpenses() {
			this.expenses = this.expenses.sort((a, b) => {
				const dateA = new Date(a.date.year, a.date.month - 1, a.date.day);
				const dateB = new Date(b.date.year, b.date.month - 1, b.date.day);
				return dateB - dateA;
			});
		},

		async getExpenses(year, month) {
			const res = await apiGetExpenses(year, month, this.$router);

			if (res) {
				this.expenses = res;
				this.sortExpenses();
			}

			this.getBalance();
		},

		async updateExpenses(updatedExpenses) {
			this.expenses = [...updatedExpenses];
			this.sortExpenses();
			await this.getBalance();
		},

		updateDate(date) {
			console.log('Date', date);
			this.selectedDate = date;
		},

		async filterExpenses(filter) {
			console.log('Filter', filter);
			console.log('Current Filter', this.currentFilter);
			console.log('Selected Date', this.selectedDate);

			if (filter === 'date' || filter === 'month' || filter === 'year') {
				const dropdownElement = document.getElementById('filter-calendar');
				const dropdown = new bootstrap.Dropdown(dropdownElement);
				dropdown.hide();
			}

			switch (filter) {
				case 'all':
					this.showedDate = {};
					this.currentFilter = 'all';

					await this.getExpenses();
					break;
				case 'last-month':
					this.showedDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
					this.currentFilter = 'last-month';

					await this.getExpenses(new Date().getFullYear(), new Date().getMonth() + 1);
					break;
				case 'last-year':
					this.showedDate = { year: new Date().getFullYear() };
					this.currentFilter = 'last-year';

					await this.getExpenses(new Date().getFullYear());
					break;
				case 'year':
					this.showedDate = this.selectedDate;
					this.currentFilter = 'year';

					await this.getExpenses(this.selectedDate.year);
					break;
				case 'month':
					this.showedDate = this.selectedDate;
					this.currentFilter = 'month';

					await this.getExpenses(this.selectedDate.year, this.selectedDate.month);
					break;
				case 'date':
					this.showedDate = this.selectedDate;
					this.currentFilter = 'date';

					await this.getExpenses(this.selectedDate.year, this.selectedDate.month);
					if (this.expenses.length > 0) {
						this.expenses = this.expenses.filter((expense) => expense.date.day === this.selectedDate.day);
					}
					break;
			}
		},
	},

	computed: {},

	created: async function () {
		console.log('created');

		const res = await apiWhoAmI(this.$router);

		if (res) {
			this.username = res.username;
			this.name = res.name;
			this.surname = res.surname;
		}
	},

	mounted: async function () {
		await this.getExpenses();
	},

	watch: {
		async query(value) {
			if (value === '') {
				await this.getExpenses();
				return;
			}

			const res = await apiQueryExpense(value, this.$router);

			if (res) {
				this.sortExpenses();
			}
		},
	},
};

export default Dashboard;
