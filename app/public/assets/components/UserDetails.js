import { apiGetBalanceWithUser } from '../js/serverInteractions.js';

const UserDetails = {
	template: `
		<section class="bg-body d-flex flex-column vh-100">
			<topbar></topbar>

			<div class="container-fluid">
				<div class="row">
					<sidebar :active_page="'users'"></sidebar>

					<section class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-body">
						<div
							class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
							<h1 class="h1">{{ this.otherUsername }} Details</h1>
						</div>

						<div class="my-4">
							<h3>Balance with the user {{ this.otherUsername }}:</h3>
              <balance v-if="balance.totalExpenditure !== 0 || balance.totalIncome !== 0" :balance="balance"></balance>
							<h5 v-if="balance.totalExpenditure === 0 && balance.totalIncome === 0" class="text-secondary">There are no expenses with the user</h5>
						</div>
					</section>
				</div>
			</div>
		</section>
  `,

	data: function () {
		return {
			balance: {
				totalExpense: 0,
				totalPayed: 0,
				totalCredit: 0,
				totalDebt: 0,
				totalGiven: 0,
				totalReceived: 0,
				totalExpenditure: 0,
				totalIncome: 0,
				totalMoneySpent: 0,
			},

			otherUsername: '',
		};
	},

	methods: {
		updateData() {
			this.getBalance();
		},

		async getBalance() {
			console.log('Viewing details of', this.otherUsername);

			const res = await apiGetBalanceWithUser(this.otherUsername, this.$router);

			if (res) {
				this.balance = res;
			}
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
