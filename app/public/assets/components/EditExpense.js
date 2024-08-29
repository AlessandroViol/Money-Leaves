import { apiEditExpense } from '../js/serverInteractions.js';

const EditExpense = {
	template: `
    <div class=" mx-0 px-0">
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
            <expense-form :defaultValues="oldExpense" :isOpen="isOpen" @editedExpense="updateExpense" @isValid="changeValid"></expense-form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary mx-auto" @click="editExpense" :disabled="!isValid">Save</button>
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
			isValid: true,
			isOpen: false,
			newExpense: {},
		};
	},

	emits: ['editExpense'],

	watch: {
		oldExpense: {
			handler(newValue, oldValue) {
				console.log('Old expense', newValue);
			},

			deep: true,
		},
	},

	methods: {
		updateExpense(editedExpense) {
			this.newExpense = editedExpense;
		},

		confirmExpense() {
			this.isOpen = true;

			const modal = new bootstrap.Modal(document.getElementById(`editExpenseConfirm${this.index}`));
			modal.show();

			modal._element.addEventListener('hidden.bs.modal', () => {
				this.isOpen = false;
			});
		},

		changeValid(value) {
			this.isValid = value;
		},

		async editExpense() {
			const modal = bootstrap.Modal.getInstance(document.getElementById(`editExpenseConfirm${this.index}`));
			modal.hide();

			const res = await apiEditExpense(this.newExpense, this.oldExpense.date, this.$router);

			if (res && res.modifiedCount > 0) {
				this.$emit('editExpense', this.newExpense);
			}
		},
	},
};

export default EditExpense;
