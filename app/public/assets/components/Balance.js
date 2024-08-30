const Balance = {
	template: `
    
    <h4 class="ms-3">
      Summary
    </h4>
    <div class="ms-4 ps-2 mt-2">
      <div>
        <h5 class="mt-3">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-custom-class="tooltip-primary"
            data-bs-title="Sum of the money spent and given."
          >
            Total Expenditure: 
          </span>
        </h5>
        <p class="h5 text-primary my-2">
          {{ (this.balance.totalExpenditure).toFixed(2) }} €
        </p>
      </div>

      <div>
        <h5 class="mt-3">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-custom-class="tooltip-danger"
            data-bs-title="Money received as refounding."
          >
            Total Income
          </span>
        </h5>
        <p class="h5 text-danger my-2">
          {{ this.balance.totalIncome.toFixed(2) }} €
        </p>
      </div>

      <hr class="mx-2 me-5"/>

      <div>
        <h5 class="mt-3">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            data-bs-custom-class="tooltip-primary"
            data-bs-title="Total money spent in the expenses."
          >
            Total Money Spent
          </span>
        </h5>
        <p class="h5 text-primary my-2">
          {{ this.balance.totalMoneySpent.toFixed(2) }} €
        </p>
      </div>
    </div>

    <h4 class="ms-3 mt-5">
      Details
    </h4>
    <div class="row row-cols-1 row-cols-sm-3 g-3">
      <div class="col d-flex flex-column">
        <div class="card border-primary h-100 my-3" style="max-width: 18rem; min-width: 10rem">
          <div class="card-header text-primary h5">Payments</div>
          <div class="card-body">
            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-primary"
                data-bs-title="Money of your quotas."
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
                data-bs-title="Money you spent."
              >
                Total Payed
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalPayed.toFixed(2) }} €</p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card border-secondary my-3" style="max-width: 18rem; min-width: 10rem">
          <div class="card-header text-secondary h5">Debts</div>
          <div class="card-body">
            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-secondary"
                data-bs-title="Money payed by other users to cover your quotas."
              >
                Total Debt
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalDebt.toFixed(2) }} €</p>

            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-secondary"
                data-bs-title="Money payed back to other users."
              >
                Total Given
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalGiven.toFixed(2) }} €</p>

            <hr />
            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-secondary"
                data-bs-title="Money that still needs to be payed."
              >
                Unsettled
              </span>
            </h5>
            <p class="card-text">{{ (this.balance.totalDebt - this.balance.totalGiven).toFixed(2) }} €</p>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card border-danger my-3" style="max-width: 18rem; min-width: 11rem">
          <div class="card-header text-danger h5">Credits</div>
          <div class="card-body">
            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-danger"
                data-bs-title="Money expected back from other users."
              >
                Total Credit
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalCredit.toFixed(2) }} €</p>

            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-danger"
                data-bs-title="Money received as refounding."
              >
                Total Received
              </span>
            </h5>
            <p class="card-text">{{ this.balance.totalReceived.toFixed(2) }} €</p>

            <hr />
            <h5 class="card-title">
              <span
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                data-bs-custom-class="tooltip-danger"
                data-bs-title="Money that you still need to receive back."
              >
                Unsettled
              </span>
            </h5>
            <p class="card-text">{{ (this.balance.totalCredit - this.balance.totalReceived).toFixed(2) }} €</p>
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

	mounted: function () {
		const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
		const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
	},
};

export default Balance;
