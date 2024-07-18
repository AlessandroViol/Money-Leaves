const QuickRefoundButton = {
	template: `
    <div>
      <button type="button" class="btn btn-sm btn-primary" @click="confirmRefound">Quick Refound</button>
    </div>

    <div class="modal fade" :id="'quickRefoundConfirm'+this.index" tabindex="-1" aria-labelledby="quickRefoundConfirmLabel" aria-hidden="true">
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="quickRefoundConfirmLabel">Delete expense</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<div>
              <h5>Refound</h5>
              <p class="small opacity-75">{{ expense.date }}</p>
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

	methods: {
		confirmRefound() {
			console.log('INdex ', this.index);
			const modal = new bootstrap.Modal(document.getElementById(`quickRefoundConfirm${this.index}`));
			modal.show();
		},

		isUserContributor(contributor) {
			return contributor.user_id === this.username;
		},

		async createExpense() {
			const response = await fetch(`/api/budget/${this.expense.date.year}/${this.expense.date.month}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(this.expense),
			});

			if (response.status === 403) {
				console.error('403 Forbidden: user not authenticated'); //!!!!!!!!!!!!!!!!!!!!!!!!! also user not payer, should not go to sign in
				//this.goToSignin();
				return;
			}

			if (!response.ok) {
				const errorMessage = `Error: ${response.statusText}`;
				this.$router.push({ path: `/error/${errorMessage}` });
				console.error(errorMessage);
				return;
			}

			const modal = bootstrap.Modal.getInstance(document.getElementById(`quickRefoundConfirm${this.index}`));
			modal.hide();

			const res = await response.json();
			console.log(res);
			this.expenses = res;
		},
	},

	mounted: function () {
		console.log('Quick refound: ', this.expense);
	},
};

export default QuickRefoundButton;
