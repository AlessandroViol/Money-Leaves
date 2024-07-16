const Balance = {
	template: `
    <div class="row row-cols-1 row-cols-sm-3 g-3 ">
      <div class="col">
        <div class="card border-primary m-3" style="max-width: 18rem; min-width: 10rem;">
          <div class="card-header text-primary h5">Payments</div>
          <div class="card-body">
            <h5 class="card-title" >
              <span 
              data-bs-toggle="tooltip"
              data-bs-placement="right" 
              data-bs-custom-class="tooltip-primary" 
              data-bs-title="The amount of money the user has spended."
              >
                Total Expense
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalExpense.toFixed(2) }} €</p>
            <h5 class="card-title">
              <span 
              data-bs-toggle="tooltip"
              data-bs-placement="right" 
              data-bs-custom-class="tooltip-primary" 
              data-bs-title="Total of the upfront payments made by the user."
              >
                Total Quotas
              </span>
            </h5>
            <p class="card-text">{{ this.balance.payed.toFixed(2) }} €</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-secondary m-3" style="max-width: 18rem; min-width: 10rem;">
          <div class="card-header text-secondary h5">Pending</div>
          <div class="card-body">
            <h5 class="card-title">
              <span 
                data-bs-toggle="tooltip"
                data-bs-placement="right" 
                data-bs-custom-class="tooltip-secondary" 
                data-bs-title="Sum of the quotas for which the user has not payed upfront."
              >
                Debt
              </span>
            </h5>
            <p class="card-text">{{ this.balance.debt.toFixed(2) }} €</p>
            <h5 class="card-title">
              <span 
                data-bs-toggle="tooltip"
                data-bs-placement="right" 
                data-bs-custom-class="tooltip-secondary" 
                data-bs-title="Sum of the quotas of the other contributors when the user payed upfront."
              >
                Credit
              </span>
            </h5>
            <p class="card-text">{{ this.balance.expectedBack.toFixed(2) }} €</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card border-danger m-3" style="max-width: 18rem; min-width: 10rem;">
          <div class="card-header text-danger h5">Refounds</div>
          <div class="card-body ">
            <h5 class="card-title">
              <span 
                data-bs-toggle="tooltip"
                data-bs-placement="right" 
                data-bs-custom-class="tooltip-danger" 
                data-bs-title="How much money the user has refounded."
              >
                Given
              </span>
            </h5>
            <p class="card-text">{{ this.balance.refounded.toFixed(2) }} €</p>
            <h5 class="card-title">
              <span 
                data-bs-toggle="tooltip"
                data-bs-placement="right" 
                data-bs-custom-class="tooltip-danger" 
                data-bs-title="How much money the user has been refounded."
              >
                Debt
              </span>
            </h5>
            <p class="card-text">{{ this.balance.received.toFixed(2) }} €</p>
          </div>
        </div>
      </div>
    </div>
  `,

	props: {
		balance: {
			type: Object,
			required: true,
		},
	},

	data: function () {},

	methods: {},

	mounted: function () {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
	},
};

export default Balance;
