const Expense = {
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
										<span class="text-white-custom small text-secondary mt-1 " style="font-size: 0.75em;">{{ dateObjToString(expense.date) }}</span>
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
					<div>
						<h5>{{expense.category}}</h5>
						<p class="small opacity-75">{{ dateObjToString(expense.date) }}</p>
					</div>

					<div>
						<h6 class="small opacity-50"> Description: </h6>
						<p>{{ expense.description }}</p>
					</div>
					
					<div>
						<h6 class="small opacity-50 mb-2">
							Contributors:
						</h6>
						<hr />
						<div class="bg-body-tertiary px-4 rounded-3">
							<header>
								<div class="small opacity-50 py-2 d-flex">
									<span class="col">Username</span>
									<span class="col text-end">Quota</span>
								</div>
							</header>
							<div class="row py-2 d-flex flex-row border-top" v-for="contributor in expense.contributors">
								<span class="col" :class="{'text-primary fw-medium': isUserContributor(contributor)}">
									<router-link :to="'/user/'+contributor.user_id" v-if="!isUserContributor(contributor)">@{{ contributor.user_id }}</router-link>
									<span v-if="isUserContributor(contributor)">@{{ contributor.user_id }}</span>
								</span>
								<span class="col text-end" :class="{'text-danger': contributor.quota<0}">{{ contributor.quota.toFixed(2) }} €</span>
							</div>
						</div>
					</div>
					<h4 class="text-end mt-3 mx-4">Total: <strong>{{ expense.total_cost.toFixed(2) }} €</strong></h4>

					<button type="button" class="btn btn-sm btn-danger" v-if="isUserPayer()" @click="deleteExpense">Delete</button>
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

	emits: ['delete'],

	methods: {
		isUserContributor(contributor) {
			return contributor.user_id === this.username;
		},

		isUserPayer() {
			return this.expense.payer_id === this.username;
		},

		deleteExpense() {
			this.$emit('delete', this.expense);
		},

		getQuota() {
			return this.expense.contributors.find((contributor) => contributor.user_id === this.username).quota;
		},

		dateObjToString(date, fullMonth = false) {
			const fullMonthLabel = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];
			const monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
			const month = fullMonth ? fullMonthLabel : monthLabel;
			const dateStr = `${date.day}/${month[date.month - 1]}/${date.year}`;
			return dateStr;
		},
	},
	computed: {},
};

export default Expense;
