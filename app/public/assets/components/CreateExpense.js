import { apiCreateExpense, apiWhoAmI } from '../js/serverInteractions.js';

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
						
						<expense-form :defaultValues="expense" @editedExpense="updateExpense"></expense-form>

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
										<button type="button" class="btn btn-primary mx-auto" @click="createExpense">Create</button>
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

			expense: {},
		};
	},

	methods: {
		updateExpense(newExpense) {
			this.expense = newExpense;
		},

		confirmExpense() {
			const modal = new bootstrap.Modal(document.getElementById(`createExpenseConfirm`));
			modal.show();
		},

		async createExpense() {
			const modal = bootstrap.Modal.getInstance(document.getElementById(`createExpenseConfirm`));
			modal.hide();

			const res = await apiCreateExpense(this.expense, this.$router);
			if (res) {
				this.$router.push({ path: '/' });
			}
		},
	},

	watch: {},

	created: async function () {
		console.log('created');

		const res = await apiWhoAmI(this.$router);

		if (res) {
			this.username = res.username;

			this.expense = {
				payer_id: res.username,
				total_cost: 0,
				description: '',
				category: '',
				date: {
					day: new Date().getDate(),
					month: new Date().getMonth() + 1,
					year: new Date().getFullYear(),
				},
				contributors: [{ user_id: res.username, quota: 0 }],
			};
		}
	},
};

export default CreateExpense;
