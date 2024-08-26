const EditExpense = {
	template: `
    <div>
      <button type="button" class="btn btn-sm btn-primary" @click="confirmExpense">Edit Expense</button>
    </div>

    <div class="modal fade" :id="'editExpenseConfirm'+this.index" tabindex="-1" aria-labelledby="editExpenseConfirmLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editExpenseConfirmLabel">Edit Expense</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <expense-form :defaultValues="oldExpense" @editedExpense="updateExpense"></expense-form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary mx-auto" @click="editExpense">Save</button>
            <button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,

	props: {
		oldExpense: {
			type: Object,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},

	data: function () {
		return {
			newExpense: {},
		};
	},

	methods: {
		updateExpense(editedExpense) {
			this.newExpense = editedExpense;
		},

		confirmExpense() {
			const modal = new bootstrap.Modal(document.getElementById(`editExpenseConfirm${this.index}`));
			modal.show();
		},

		async editExpense() {
			const modal = new bootstrap.Modal(document.getElementById(`editExpenseConfirm${this.index}`));
			modal.hide();

			console.log('Adding expense :', this.newExpense);
			const response = await fetch(
				`/api/budget/${this.newExpense.date.year}/${this.newExpense.date.month}/${this.newExpense._id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(this.newExpense),
				}
			);

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
			console.log(res);
			this.$router.push({ path: '/' });
		},
	},
};

export default EditExpense;
