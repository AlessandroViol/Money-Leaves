const CreateExpense = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar :active_page="'new-expense'"></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div
							class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h1 class="h1">New Expense</h1>
						</div>

						<div class="my-4">
              <label for="payer_id" class="form-label">Payer username</label>
							<div class="input-group mb-3">
                <span class="input-group-text" id="payer_id">@</span>
                <input type="text" class="form-control" :value="username" aria-label="Payer Username" aria-describedby="payer_id" readonly>
              </div>
              
              <label for="total_cost" class="form-label">Total</label>
							<div class="input-group mb-3">
                <input 
                  type="number" 
                  class="form-control" 
                  aria-label="Euros amount (with dot and two decimal places)" 
                  v-model.number="total_cost"
                  min="0" max="2000" 
                >
                <span class="input-group-text" id="total_cost">€</span>
              </div>

              <label for="category" class="form-label">Category</label>
							<select class="form-select mb-3" v-model="selected_category" aria-label="Default select example">
                <option disabled value="">Select a category</option>
                <option v-for="category in categories" :value="category">{{category}}</option>
              </select>

              <label for="date" class="form-label">Date</label>
              <div class="input-group mb-3">
                <input type="text" class="form-control" aria-label="Expense date" aria-describedby="expense-date" :value="date_string" readonly>
                <div class="btn-group">
                  <button id="filter-calendar" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center rounded-0 rounded-end gap-1" 
                    type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" 
                  >
                    <svg class="bi">
                      <use xlink:href="#calendar3" />
                    </svg>
                  </button>
                  <div class="dropdown-menu dropdown-menu-end py-0 border-0">
                    <calendar @updateDate="updateDate"></calendar>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control" id="description" rows="3" v-model="description" placeholder="Expense's description"></textarea>
              </div>

              <div class="bg-body-tertiary px-4 pb-2 rounded-3">
                <header>
                  <div class="small opacity-50 py-2 d-flex">
                    <span class="col">Username</span>
                    <span class="col text-end">Quota</span>
                  </div>
                </header>
                <div class="row py-2 d-flex flex-row border-top" v-for="contributor in contributors">
                  <span class="col" :class="{'text-primary fw-medium': isCurrentUser(contributor.user_id)}">
										@{{ contributor.user_id }}
									</span>
                  <span class="col text-end" >
										<span :class="{'text-danger': contributor.quota<0}" v-if="isCurrentUser(contributor.user_id)">
											{{ contributor.quota.toFixed(2) }} €
										</span>
										<span v-if="!isCurrentUser(contributor.user_id)">
											<span class="input-group mb-3">
												<input 
													type="number" 
													class="form-control" 
													aria-label="Euros amount (with dot and two decimal places)" 
													v-model.number="contributor.quota"
													min="-2000" max="2000" 
												>
												<span class="input-group-text" id="quota">€</span>
											</span>
											<a class="link-danger" href="#" @click.prevent="removeContributor(contributor.user_id)">
												<span class="material-symbols-outlined align-middle" style="font-size:1rem;">cancel</span>
											</a>
										</span>
									</span>
                </div>
                
								<div class="mt-4">
									<div class="mb-3">
										<button
											class="btn btn-outline-secondary btn-lg px-3 w-100"
											type="button"
											data-bs-toggle="collapse"
											data-bs-target="#expenseSearch"
											aria-controls="expenseSearch"
											aria-expanded="false"
											aria-label="Toggle search"
											@click="collapseSearch"
										>
											<span class="material-symbols-outlined align-middle">
												person_add
											</span>
										</button>
									</div>

									<div id="expenseSearch" class="w-100 collapse px-2 mb-3">
										<div class="shadow mb-2">
											<input class="py-3 rounded bg-body-secondary form-control" type="text" placeholder="Search" aria-label="Search" v-model="query"/>
										</div>

										<div class="px-3">
											<div v-for="user in userList">
												<div class="row py-2 d-flex flex-row border-bottom" v-if="user._id !== username">
													<span class="col">
														@{{ user._id }}
													</span>
													<span class="col">
														{{ user.name }}
													</span>
													<span class="col">
														{{ user.surname }}
													</span>
													<button class="btn btn-sm btn-primary col" @click="addContributor(user._id)" :disabled="isContributor(user._id)">Select</button>
												</div>
											</div>
										</div>
									</div>

								</div>
              </div>

						</div>
						

						<div>
							<button type="button" class="btn btn-sm btn-primary" @click="confirmExpense">Create Expense</button>
						</div>

						<div class="modal fade" id="createExpenseConfirm" tabindex="-1" aria-labelledby="createExpenseConfirmLabel" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered">
								<div class="modal-content">
									<div class="modal-header">
										<h1 class="modal-title fs-5" id="createExpenseConfirmLabel">Create Expense</h1>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
									<div class="modal-body">
										<expense :expense="expense" :username="username"></expense> 
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-primary mx-auto" >Yes</button>
										<button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">Cancel</button>
									</div>
								</div>
							</div>
						</div>


					</section>

				</div>
			</div>
		</section>
  `,

	data: function () {
		return {
			username: '',

			total_cost: 0.0,
			categories: [
				'Refound',
				'Food and beverages',
				'Entertainment',
				'Taxes and bills',
				'Transportation',
				'Travel',
				'Present',
			],
			selected_category: '',
			selected_date: {
				day: new Date().getDate(),
				month: new Date().getMonth(),
				year: new Date().getFullYear(),
			},
			description: '',

			contributors: [],

			query: '',
			userList: [],

			expense: { total_cost: 0 },
		};
	},

	methods: {
		goToSignin() {
			this.$router.push({ path: '/signin' });
		},

		updateDate(date) {
			console.log('Date', date);
			this.selected_date = date;
		},

		isCurrentUser(user_id) {
			return user_id === this.username;
		},

		isContributor(user_id) {
			return this.contributors.find((contributor) => contributor.user_id === user_id);
		},

		addContributor(user_id) {
			if (!this.isContributor(user_id)) {
				this.contributors.push({ user_id, quota: 0 });
			}
		},

		removeContributor(user_id) {
			this.contributors = this.contributors.filter((contributor) => contributor.user_id !== user_id);
		},

		collapseSearch() {
			this.userList = [];
			this.query = '';
		},

		confirmExpense() {
			this.expense = {
				payer_id: this.username,
				total_cost: this.total_cost,
				description: this.description,
				category: this.selected_category,
				date: this.selected_date,
				contributors: this.contributors,
			};

			console.log('Expense created: ', this.expense);

			const modal = new bootstrap.Modal(document.getElementById(`createExpenseConfirm`));
			modal.show();
		},
	},

	computed: {
		date_string() {
			return `${this.selected_date.day}/${this.selected_date.month}/${this.selected_date.year}`;
		},
	},

	watch: {
		total_cost(value) {
			this.contributors[0].quota =
				value - this.contributors.reduce((sumOfQuotas, { quota }) => sumOfQuotas + quota, 0) + this.contributors[0].quota;
		},

		async query(value) {
			if (value === '') {
				this.userList = [];
				return;
			}
			const response = await fetch(`/api/users/search?q=${value}`, {
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
				console.log('Users: ', res);

				this.userList = res;
			}
		},
	},

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
			this.username = res.username;
			this.contributors.push({ user_id: res.username, quota: 0 });
		}
	},
};

export default CreateExpense;
