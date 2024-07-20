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
                  v-model="total_cost" 
                  min="0" max="2000" 
                  :formatter="moneyFormat"
                >
                <span class="input-group-text" id="total_cost">€</span>
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

			total_cost: 0,

			query: '',
			userList: [],
		};
	},

	methods: {
		moneyFormat(value) {
			return value.tofixed(2);
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},

	watch: {
		total_cost(value) {
			console.log('wtf');
			if (value > 2000) {
				value = 2000;
			} else if (value < 0) {
				value = 0;
			}
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
		}
	},
};

export default CreateExpense;
