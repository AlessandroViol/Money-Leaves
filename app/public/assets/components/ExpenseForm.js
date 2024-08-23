const ExpenseForm = {
	template: `
    <div class="my-4">
      <label for="payer_id" class="form-label">Payer username</label>
      <div class="input-group mb-3">
        <span class="input-group-text" id="payer_id">@</span>
        <input type="text" class="form-control" :value="expense.payer_id" aria-label="Payer Username" aria-describedby="payer_id" readonly>
      </div>
      
      <label for="total_cost" class="form-label">Total</label>
      <div class="input-group mb-3">
        <input 
          type="number" 
          class="form-control" 
          aria-label="Euros amount (with dot and two decimal places)" 
          v-model.number="expense.total_cost"
          min="0" max="2000" 
        >
        <span class="input-group-text" id="total_cost">€</span>
      </div>

      <label for="category" class="form-label">Category</label>
      <select class="form-select mb-3" v-model="expense.category" aria-label="Default select example">
        <option disabled value="">Select a category</option>
        <option v-for="category in categories" :value="category">{{category}}</option>
      </select>

      <label for="date" class="form-label">Date</label>
      <div class="input-group mb-3">
        <input type="text" class="form-control" aria-label="Expense date" aria-describedby="expense-date" :value="date_string" readonly>
        <div class="btn-group">
          <button id="filter-calendar" class="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center rounded-0 rounded-end gap-1" 
            type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false" 
          >
            <svg class="bi">
              <use xlink:href="#calendar3" />
            </svg>
          </button>
          <div class="dropdown-menu dropdown-menu-end py-0 border-0">
            <calendar @updateDate="updateDate"></calendar>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" rows="3" v-model="expense.description" placeholder="Expense's description"></textarea>
      </div>

      <div class="bg-body-tertiary px-4 pb-2 rounded-3">
        <header>
          <div class="small opacity-50 py-2 d-flex">
            <span class="col">Username</span>
            <span class="col text-end">Quota</span>
          </div>
        </header>
        <div class="row py-2 d-flex flex-row border-top" v-for="contributor in expense.contributors">
          <span class="col" :class="{'text-primary fw-medium': isCurrentUser(contributor.user_id)}">
            @{{ contributor.user_id }}
          </span>
          <span class="col text-end" >
            <span :class="{'text-danger': contributor.quota<0}" v-if="isCurrentUser(contributor.user_id)">
              {{ contributor.quota.toFixed(2) }} €
            </span>
            <span v-if="!isCurrentUser(contributor.user_id)">
              <span class="input-group mb-3">
                <input 
                  type="number" 
                  class="form-control" 
                  aria-label="Euros amount (with dot and two decimal places)" 
                  v-model.number="contributor.quota"
                  @input="updateQuota"
                  min="-2000" max="2000" 
                >
                <span class="input-group-text" id="quota">€</span>
              </span>
              <a class="link-danger" href="#" @click.prevent="removeContributor(contributor.user_id)">
                <span class="material-symbols-outlined align-middle" style="font-size:1rem;">cancel</span>
              </a>
            </span>
          </span>
        </div>
        
        <div class="mt-4">
          <div class="mb-3">
            <button
              class="btn btn-outline-secondary btn-lg px-3 w-100"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#expenseSearch"
              aria-controls="expenseSearch"
              aria-expanded="false"
              aria-label="Toggle search"
              @click="collapseSearch"
            >
              <span class="material-symbols-outlined align-middle">
                person_add
              </span>
            </button>
          </div>

          <div id="expenseSearch" class="w-100 collapse px-2 mb-3">
            <div class="shadow mb-2">
              <input class="py-3 rounded bg-body-secondary form-control" type="text" placeholder="Search" aria-label="Search" v-model="query"/>
            </div>

            <div class="px-3">
              <div v-for="user in userList">
                <div class="row py-2 d-flex flex-row border-bottom" v-if="!isCurrentUser(user._id)">
                  <span class="col">
                    @{{ user._id }}
                  </span>
                  <span class="col">
                    {{ user.name }}
                  </span>
                  <span class="col">
                    {{ user.surname }}
                  </span>
                  <button class="btn btn-sm btn-primary col" @click="addContributor(user._id)" :disabled="isContributor(user._id)">Select</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
    `,

	props: {
		defaultValues: {
			type: Object,
			required: true,
		},
	},

	data: function () {
		return {
			categories: [
				'Refound',
				'Food and beverages',
				'Entertainment',
				'Taxes and bills',
				'Transportation',
				'Travel',
				'Present',
			],

			query: '',
			userList: [],

			expense: {
				_id: this.defaultValues._id,
				payer_id: this.defaultValues.payer_id,
				total_cost: this.defaultValues.total_cost,
				description: this.defaultValues.description,
				category: this.defaultValues.category,
				date: this.defaultValues.date,
				contributors: this.defaultValues.contributors,
			},
		};
	},

	methods: {
		updateDate(date) {
			console.log('Date', date);
			this.expense.date = date;
		},

		updateQuota() {
			this.expense.contributors[0].quota = this.payer_quota;
		},

		isCurrentUser(user_id) {
			return user_id === this.expense.payer_id;
		},

		isContributor(user_id) {
			return this.expense.contributors.find((contributor) => contributor.user_id === user_id);
		},

		addContributor(user_id) {
			if (!this.isContributor(user_id)) {
				this.expense.contributors.push({ user_id, quota: 0 });
			}
		},

		removeContributor(user_id) {
			this.expense.contributors = this.expense.contributors.filter((contributor) => contributor.user_id !== user_id);
		},

		collapseSearch() {
			this.userList = [];
			this.query = '';
		},
	},

	computed: {
		payer_quota() {
			return (
				this.expense.total_cost -
				this.expense.contributors.reduce((sumOfQuotas, { quota }) => sumOfQuotas + quota, 0) +
				this.expense.contributors[0].quota
			);
		},

		date_string() {
			return `${this.expense.date.day}/${this.expense.date.month}/${this.expense.date.year}`;
		},
	},

	emits: ['editedExpense'],

	watch: {
		'expense.total_cost'() {
			this.expense.contributors[0].quota = this.payer_quota;
			this.$emit('editedExpense', this.expense);
		},

		expense: {
			a: `'expense.category'() {
        this.$emit('editedExpense', this.expense);
      },
      
      'expense.description'() {
        this.$emit('editedExpense', this.expense);
      },

      'expense.date'() {
        this.$emit('editedExpense', this.expense);
      },

      'expense.contributors'() {
        this.$emit('editedExpense', this.expense);
      },`,

			handler(newValue, oldValue) {
				this.$emit('editedExpense', oldValue);
			},

			deep: true,
		},

		async query(value) {
			if (value === '') {
				this.userList = [];
				return;
			}
			const response = await fetch(`/api/users/search?q=${value}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

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

			if (response.ok) {
				const res = await response.json();
				console.log('Users: ', res);

				this.userList = res;
			}
		},
	},
};

export default ExpenseForm;
