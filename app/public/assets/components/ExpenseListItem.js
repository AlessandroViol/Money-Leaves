const ExpenseListItem = {
	template: `
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#accordionExpense'+index" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
					<div class="container-fluid">
						<div class="row row-cols-4 gx-2">

							<div class="col-3 text-truncate">
								<div class="row">

									<div class="col text-truncate">
										<span class="text-white-custom" :class="{'text-primary fw-medium': isUserPayer()}">{{ expense.payer_id }}</span>
									</div>

								</div>
								<div class="row">
								
									<div class="col text-truncate">
										<expense-date class="text-white-custom text-secondary mt-1 " style="font-size: 0.75em;" :date="expense.date"></expense-date>
									</div>

								</div>
							</div>

							<div class="col-5 text-truncate">
								<span class="align-middle text-white-custom" :class="{'text-danger': expense.category === 'Refound'}">{{ expense.category }}</span>
							</div>

							<div class="col-2 text-truncate">
								<span class="align-middle">{{ expense.total_cost.toFixed(2) }} €</span>
							</div>

							<div class="col-2 text-truncate">
								<span class="align-middle">{{ getQuota().toFixed(2) }} €</span>
							</div>
							
						</div>
					</div>
        </button>
      </h2>

      <div :id="'accordionExpense'+index" class="accordion-collapse collapse" data-bs-parent="#accordionExpenses">
        <div class="accordion-body">

					<expense :expense="expense" :username="this.username"></expense> 

					<div class="d-flex pe-0 me-0">
						<span class="me-3">
							<edit-expense :oldExpense="{...expense, date:{...expense.date}}" :index="this.index" v-if="isUserPayer()" @editExpense="editExpense"></edit-expense>
						</span>

						<span>
							<button type="button" class="btn btn-sm btn-danger" v-if="isUserPayer()" @click="deleteExpense">Delete</button>
						</span>

						<span>
							<quick-refound-button 
								v-if="!isUserPayer() && expense.category !== 'Refound'" 
								:username="this.username" 
								:recipient="this.expense.payer_id" 
								:motive="this.expense.description"
								:amount="this.getQuota()"
								:index="this.index"
								@addRefound="addExpense"
							>
							</quick-refound-button>
						</span>
					</div>

					
        </div>
      </div>
    </div>
  `,

	props: {
		expense: {
			type: Object,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		index: {
			type: Number,
			required: true,
		},
	},

	data() {
		return {};
	},

	emits: ['deleteExpense', 'addExpense', 'editExpense'],

	methods: {
		isUserContributor(contributor) {
			return contributor.user_id === this.username;
		},

		isUserPayer() {
			return this.expense.payer_id === this.username;
		},

		deleteExpense() {
			this.$emit('deleteExpense', this.expense);
		},

		addExpense(newExpense) {
			this.$emit('addExpense', newExpense);
		},

		editExpense(editedExpense) {
			this.$emit('editExpense', { ...editedExpense, date: { ...editedExpense.date } });
		},

		getQuota() {
			return this.expense.contributors.find((contributor) => contributor.user_id === this.username).quota;
		},
	},
};

export default ExpenseListItem;
