import { apiQueryUser } from '../js/serverInteractions.js';

const ExpenseForm = {
	template: `
    <div class="my-4">
      <label for="payer_id" class="form-label">Payer username</label>
      <div class="input-group mb-3">
        <span class="input-group-text" id="payer_id">@</span>
        <input type="text" class="form-control" :value="expense.payer_id" aria-label="Payer Username" aria-describedby="payer_id" readonly>
      </div>
      
      <div class="row">
        <span class="col" style="max-width: 16rem">
          <label for="date" class="form-label">Date</label>
          <div class="input-group mb-3">
            <input type="text" :class="{ 'is-invalid': !is_date_valid }" class="form-control" aria-label="Expense date" aria-describedby="expense-date" :value="date_string" readonly>
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
            <div v-if="!is_date_valid" class="invalid-feedback">The date must be between today and 01/01/2020.</div>
          </div>
        </span>

        <span class="col" style="max-width: 16rem">
          <label for="total_cost" class="form-label">Total</label>
          <div class="input-group mb-3 has-validation">
            <input 
              type="number" 
              class="form-control" 
              :class="{ 'is-invalid': !is_total_valid }"
              aria-label="Euros amount (with dot and two decimal places)" 
              v-model.number="expense.total_cost"
              min="0" max="2000" 
              required
            >
            <span class="input-group-text" id="total_cost">€</span>
            <div v-if="!is_total_valid && expense.category !== 'Refound'" class="invalid-feedback">Total cost must be greater than 0.00 € and lesser then 2000.00 €</div>
            <div v-if="!is_total_valid && expense.category === 'Refound'" class="invalid-feedback">Total cost must 0.00 € when you are making a Refound.</div>
          </div>
        </span>
      </div>

      <div class="mb-3">
        <label for="category" class="form-label has-validation">Category</label>
        <select class="form-select" :class="{'is-invalid': !is_category_valid}" v-model="expense.category" aria-label="Category select"  style="max-width: 14rem">
          <option disabled value="Select a category" selected>Select a category</option>
          <option v-for="category in categories" :value="category">{{category}}</option>
        </select>
        <div v-if="!is_category_valid" class="invalid-feedback">You must select a category.</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" :class="{'is-invalid': !is_description_valid}" id="description" rows="3" v-model="expense.description" placeholder="Expense's description">
        </textarea>
        <div v-if="!is_description_valid" class="invalid-feedback">You must type a description.</div>
      </div>


      <div v-if="!are_contributors_valid && expense.category === 'Refound'" class="invalid-label small">You must have two contributors.</div>
      <div v-if="!are_contributors_valid && expense.category !== 'Refound'" class="invalid-label small">You must add at least one more contributor.</div>
      <div class="bg-body-tertiary px-4 pb-2 rounded-3" :class="{'invalid-box': !are_contributors_valid}">
        <header>
          <div class="small opacity-50 py-2 d-flex">
            <span class="col">Username</span>
            <span class="col text-end">Quota</span>
          </div>
        </header>

        <div v-if="!is_default_quota_valid" class="invalid-label small text-end">Your quota must be greater than 0.00 €.</div>
        <div class="row py-2 d-flex flex-row border-top align-items-center " v-for="contributor in expense.contributors">
          <span class="col" :class="{'text-primary fw-medium': isCurrentUser(contributor.user_id)}">
            @{{ contributor.user_id }}
          </span>

          <span v-if="!isCurrentUser(contributor.user_id)">
            <div v-if="!isQuotaValid(contributor.quota) && expense.category !== 'Refound'" class="invalid-label text-end">Quota must be greater than 0.00 €</div>
            <div v-if="!isQuotaValid(contributor.quota) && expense.category === 'Refound'" class="invalid-label text-end">Quota must be lesser than 0.00 €</div>
          </span>
          <span class="col text-end align-items-center ">
            <span :class="{'invalid-label': !is_default_quota_valid}" v-if="isCurrentUser(contributor.user_id)">
              {{ (contributor.quota).toFixed(2) }} €
            </span>
            <div class="d-flex align-items-center justify-content-end" v-if="!isCurrentUser(contributor.user_id)">
              <div class="input-group me-3" style="max-width: 8rem">
                <input 
                  type="number" 
                  class="form-control" 
                  :class="{'is-invalid': !isQuotaValid(contributor.quota)}"
                  aria-label="Euros amount (with dot and two decimal places)" 
                  v-model.number="contributor.quota"
                  @input="updateQuota"
                  min="-2000" max="2000" 
                >
                <span class="input-group-text" id="quota">€</span>
              </div>
              <a class="link-danger pb-1" href="#" @click.prevent="removeContributor(contributor.user_id)">
                <span class="material-symbols-outlined align-middle" style="font-size:1rem;">cancel</span>
              </a>
            </div>
          </span>
        </div>
        
        <div class="mt-4">
          <div class="mb-3">
            <button
              class="btn btn-outline-secondary btn-lg px-3 w-100"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#userSearch"
              aria-controls="userSearch"
              aria-expanded="false"
              aria-label="Toggle search"
              @click="collapseSearch"
            >
              <span class="material-symbols-outlined align-middle">
                person_add
              </span>
            </button>
          </div>

          <div id="userSearch" class="w-100 collapse px-2 mb-3">
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

		isOpen: {
			type: Boolean,
			required: false,
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
				category: this.defaultValues.category ? this.defaultValues.category : 'Select a category',
				date: { ...this.defaultValues.date },
				contributors: this.defaultValues.contributors.map((contributor) => {
					return { ...contributor };
				}),
			},
		};
	},

	methods: {
		resetForm() {
			this.expense = JSON.parse(JSON.stringify(this.defaultValues));
		},

		updateDate(date) {
			console.log('Date', date);
			this.expense.date = date;
			this.$emit('editedExpense', this.expense);
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
			this.updateQuota();
		},

		collapseSearch() {
			this.userList = [];
			this.query = '';
		},

		isQuotaValid(quota) {
			return (quota > 0 && this.expense.category !== 'Refound') || (quota < 0 && this.expense.category === 'Refound');
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

		is_date_valid() {
			const expenseDate = new Date(this.expense.date.year, this.expense.date.month - 1, this.expense.date.day);
			const today = new Date();
			const minDate = new Date(2020, 0, 1);
			return expenseDate - today <= 0 && expenseDate - minDate >= 0;
		},

		is_total_valid() {
			return (
				((this.expense.total_cost > 0 && this.expense.category !== 'Refound') ||
					(this.expense.total_cost === 0 && this.expense.category === 'Refound')) &&
				this.expense.total_cost <= 2000
			);
		},

		is_category_valid() {
			return this.categories.includes(this.expense.category);
		},

		is_description_valid() {
			return this.expense.description.length > 0;
		},

		are_contributors_valid() {
			return (
				(this.expense.contributors.length >= 2 && this.expense.category !== 'Refound') ||
				(this.expense.contributors.length === 2 && this.expense.category === 'Refound')
			);
		},

		is_default_quota_valid() {
			return this.expense.contributors.length !== 0 && this.expense.contributors[0].quota > 0;
		},

		is_expense_valid() {
			let are_quotas_valid = true;

			this.expense.contributors.forEach((contributor) => {
				are_quotas_valid =
					this.isCurrentUser(contributor.user_id) || (are_quotas_valid && this.isQuotaValid(contributor.quota));
			});

			return (
				this.is_date_valid &&
				this.is_total_valid &&
				this.is_category_valid &&
				this.is_description_valid &&
				this.are_contributors_valid &&
				this.is_default_quota_valid &&
				are_quotas_valid
			);
		},
	},

	emits: ['editedExpense', 'isValid'],

	watch: {
		isOpen() {
			this.resetForm();
		},

		'expense.total_cost'() {
			this.expense.contributors[0].quota = this.payer_quota;
			this.$emit('editedExpense', this.expense);
		},

		expense: {
			handler(newValue, oldValue) {
				this.$emit('editedExpense', newValue);
			},

			deep: true,
		},

		is_expense_valid() {
			this.$emit('isValid', this.is_expense_valid);
		},

		async query(value) {
			if (value === '') {
				this.userList = [];
				return;
			}

			const res = await apiQueryUser(value, this.$router);

			if (res) {
				this.userList = res;
			}
		},
	},
};

export default ExpenseForm;
