const ExpenseList = {
	template: `
		<header class="" style="padding-left:1.25rem; padding-right:2.5rem;">
			<div class="container-fluid">
				<div class="row row-cols-4 gx-2">

					<div class="col-3 text-truncate" style="padding-right: calc(var(--bs-gutter-x)* 0.5);">
						<span class="small opacity-50 text-truncate mb-2">Payer</span>
					</div>

					<div class="col-5 text-truncate">
						<span class="small opacity-50 text-truncate mb-2">Category</span>
					</div>

					<div class="col-2 text-truncate">
						<span class="small opacity-50 text-truncate mb-2">Total</span>
					</div>

					<div class="col-2 text-truncate">
						<span class="small opacity-50 text-truncate mb-2">Quota</span>
					</div>

				</div>
			</div>
		</header>
		<hr class="m-2"/>
		<div class="accordion pb-5" id="accordionExpenses">
			<expense-list-item v-for="(expense, index) in this.expenses" :expense="expense" :username="this.username" :index="index" @delete="this.confirmDelete" @add="this.addExpense">
			</expense-list-item>
		</div>

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

	props: {
		expenses: {
			type: Array,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
	},

	data: function () {
		return {
			selectedExpense: {},
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
				console.error('403 Forbidden: user not authenticated'); ///////////////////////////////////////////////not trueeee user may not be the payer
				this.goToSignin();
				return;
			}

			if (response.ok) {
				const updatedExpenses = this.expenses.filter((expense) => expense._id !== this.selectedExpense._id);
				console.log('Deleted. New expenses: ', updatedExpenses);
				this.selectedExpense = {};
				this.$emit('update', updatedExpenses);
			}

			const res = await response.json();
			console.log(res);
		},

		confirmDelete(expense) {
			console.log(expense);
			this.selectedExpense = expense;
			const modal = new bootstrap.Modal(document.getElementById('deleteConfirm'));
			modal.show();
		},

		addExpense(newExpense) {
			const updatedExpenses = this.expenses.push(newExpense);
			this.$emit('update', updatedExpenses);
		},

		goToSignin() {
			this.$router.push({ path: '/signin' });
		},
	},

	emits: ['update'],
};

export default ExpenseList;
