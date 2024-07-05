const UserDetails = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div
							class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h1 class="h1">{{ $route.params.otherUsername }} Details</h1>
							
							<div class="btn-toolbar mb-2 mb-md-0">
								<div class="btn-group me-2">
									<button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
									<button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
								</div>
							</div>
							
						</div>

						<div class="my-4">
							<h3>Balance with the user:</h3>
              <h4 :class={ "text-danger", total < 0 }>Total: {{ total }} </h4>
              <hr/>
							<h5 class="fs-2 fw-bolder text-primary" v-for="user in balance">{{ user._id  }} {{ user.balance.toFixed(2) }} €</h5>
						</div>
					</section>
				</div>
			</div>
		</section>
  `,

	data: function () {
		return {
			balance: [],
      total: 0,
		};
	},

	methods: {
		updateData() {
			this.getBalance();
		},

		async getBalance() {
			console.log('Viewing details of', this.$route.params.otherUsername);

			const response = await fetch(`/api/balance/${this.$route.params.otherUsername}`, {
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
			console.log("balance", res);
			this.balance = res;
      this.total = this.balance[0].balance - this.balance[1].balance
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},

	mounted: async function () {
    await this.getBalance();
  },
};

export default UserDetails;
