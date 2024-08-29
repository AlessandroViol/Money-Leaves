import { apiCreateExpense } from '../js/serverInteractions.js';

const QuickRefoundButton = {
	template: `
    <div>
      <button type="button" class="btn btn-sm btn-primary" @click="confirmRefound">Quick Refound</button>
    </div>

    <div class="modal fade" :id="'quickRefoundConfirm'+this.index" tabindex="-1" aria-labelledby="quickRefoundConfirmLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="quickRefoundConfirmLabel">Make Refound</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<expense :expense="expense" :username="this.username"></expense> 
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-primary mx-auto" @click='createExpense'>Yes</button>
						<button type="button" class="btn btn-secondary mx-auto" data-bs-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
  `,

	props: {
		username: {
			type: String,
			required: true,
		},
		recipient: {
			type: String,
			required: true,
		},
		motive: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {
			expense: {
				payer_id: this.username,
				total_cost: 0,
				description: `Refound for ${this.motive}`,
				category: 'Refound',
				date: {
					year: new Date().getFullYear(),
					month: new Date().getMonth() + 1,
					day: new Date().getDate(),
				},
				contributors: [
					{
						user_id: this.username,
						quota: this.amount,
					},
					{
						user_id: this.recipient,
						quota: -this.amount,
					},
				],
			},
		};
	},

	emits: ['addRefound'],

	methods: {
		confirmRefound() {
			console.log('Selected expense #: ', this.index);
			const modal = new bootstrap.Modal(document.getElementById(`quickRefoundConfirm${this.index}`));
			modal.show();
		},

		isUserContributor(contributor) {
			return contributor.user_id === this.username;
		},

		async createExpense() {
			const modal = bootstrap.Modal.getInstance(document.getElementById(`quickRefoundConfirm${this.index}`));
			modal.hide();

			const res = await apiCreateExpense(this.expense, this.$router);
			if (res) {
				this.expense._id = res.insertedId;
				console.log('Created quick refound: ', this.expense);
				this.$emit('addRefound', this.expense);
			}
		},
	},
};

export default QuickRefoundButton;
