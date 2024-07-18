const Expense = {
	template: `
    <div>
      <h5>{{expense.category}}</h5>
      <p>
        <expense-date :date="expense.date"></expense-date>
      </p>
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
	},

	data() {
		return {};
	},

	methods: {
		isUserContributor(contributor) {
			return contributor.user_id === this.username;
		},

		isUserPayer() {
			return this.expense.payer_id === this.username;
		},

		getQuota() {
			return this.expense.contributors.find((contributor) => contributor.user_id === this.username).quota;
		},
	},
};

export default Expense;
