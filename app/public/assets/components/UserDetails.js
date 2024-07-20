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
							<h1 class="h1">{{ this.otherUsername }} Details</h1>
						</div>

						<div class="my-4" v-if="balance.length > 0">
							<h3>Balance with the user {{ this.otherUsername }}:</h3>
              <balance :balance="balance[0]"></balance>
						</div>
					</section>
				</div>
			</div>
		</section>
  `,

	data: function () {
		return {
			balance: [],
			otherUsername: '',
		};
	},

	methods: {
		updateData() {
			this.getBalance();
		},

		async getBalance() {
			console.log('Viewing details of', this.otherUsername);

			const response = await fetch(`/api/balance/${this.otherUsername}`, {
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
			console.log('balance', res);
			this.balance = res;
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},

	created() {
		this.otherUsername = this.$route.params.otherUsername;
	},

	mounted: async function () {
		await this.getBalance();
	},
};

export default UserDetails;
