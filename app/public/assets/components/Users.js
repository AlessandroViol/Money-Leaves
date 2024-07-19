const Users = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar :active_page="'users'"></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
            <h1 class="h1 mt-3">Users</h1>
						<div class="d-flex justify-content-between">
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
						<div id="expenseSearch" class="rounded shadow mb-3 w-100 collapse">
							<input class="py-3 rounded bg-body-secondary form-control w-100 border-0" type="text" placeholder="Search" aria-label="Search" v-model="query"/>
						</div>

            <div v-for="user in userList">
              <div class="row py-2 d-flex flex-row border-top"  v-if="user._id !== username">
                <span class="col">
                  <router-link :to="'/user/'+user._id">@{{ user._id }}</router-link>
                </span>
                <span class="col">
                  {{ user.name }}
                </span>
                <span class="col">
                  {{ user.surname }}
                </span>
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
			query: '',
			userList: [],
		};
	},

	methods: {
		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},

	watch: {
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
			console.log('Displaying dashboard for: ', res.username);

			this.username = res.username;
		}
	},
};

export default Users;
