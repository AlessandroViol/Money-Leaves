const Expense = {
	template: `
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#accordionExpense'+index" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
          <span class="small col-sm text-truncate w-25 mx-1">{{ dateObjToString(expense.date) }}</span>
          <span class="small col-sm-6 text-truncate w-25 mx-1">{{ expense.category }}</span>
          <span class="small col-sm text-truncate w-25 mx-1">{{ expense.total_cost.toFixed(2) }} €</span>
          <span class="small col-sm text-truncate w-25 mx-1">{{ getQuota().toFixed(2) }} €</span>
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
									<router-link :to="'/user/'+contributor.user_id" v-if="!isUserContributor(contributor)" class="">@{{ contributor.user_id }}</router-link>
									<span v-if="isUserContributor(contributor)">@{{ contributor.user_id }}</span>
								</span>
								<span class="col text-end" :class="{'text-danger': contributor.quota<0}">{{ contributor.quota.toFixed(2) }} €</span>
							</div>
						</div>
					</div>
					<h4 class="text-end mt-3 mx-4">Total: <strong>{{ expense.total_cost.toFixed(2) }} €</strong></h4>

					<button type="button" class="btn btn-sm btn-danger" @click="deleteExpense">Delete</button>
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

	methods: {
		isUserContributor(contributor) {
			return contributor.user_id === this.username;
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
