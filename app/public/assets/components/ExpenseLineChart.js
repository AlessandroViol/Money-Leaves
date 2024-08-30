const { toRaw } = Vue;

const ExpenseLineChart = {
	template: `
    <div class="chart-container">
      <canvas class="w-100" id="myChart"></canvas>
    </div>
  `,

	props: {
		expenses: {
			type: Array,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
	},

	data: function () {
		return {
			myChart: null,
		};
	},

	methods: {
		aggregateExpensesByDate() {
			const aggregatedExpenses = {};

			this.expenses.forEach((expense) => {
				const dateKey = `${expense.date.day}/${expense.date.month}/${expense.date.year}`;

				if (!aggregatedExpenses[dateKey]) {
					aggregatedExpenses[dateKey] = {
						payed: 0,
						realExpense: 0,
						received: 0,
					};
				}

				if (expense.payer_id === this.username) {
					aggregatedExpenses[dateKey].payed +=
						expense.category === 'Refound' ? expense.contributors[0].quota : expense.total_cost;
				}

				const contributor = expense.contributors.find((contributor) => contributor.user_id === this.username);
				if (contributor && expense.category !== 'Refound') {
					aggregatedExpenses[dateKey].realExpense += contributor.quota;
				}

				if (expense.category === 'Refound' && expense.payer_id !== this.username) {
					aggregatedExpenses[dateKey].received += expense.contributors[0].quota;
				}
			});

			return aggregatedExpenses;
		},

		drawLinePlot() {
			const aggregatedData = this.aggregateExpensesByDate();

			const labels = Object.keys(aggregatedData).reverse();
			const payed = labels
				.map((label) => aggregatedData[label].payed)
				.map((value) => (value === 0 ? null : value))
				.reverse();
			const realExpenses = labels
				.map((label) => aggregatedData[label].realExpense)
				.map((value) => (value === 0 ? null : value))
				.reverse();
			const received = labels
				.map((label) => aggregatedData[label].received)
				.map((value) => (value === 0 ? null : value))
				.reverse();

			const data = {
				labels: labels,
				datasets: [
					{
						label: 'Payed',
						data: payed.reverse(),
						lineTension: 0,
						backgroundColor: 'transparent',
						borderColor: 'rgba(40, 167, 69, 0.7)',
						borderWidth: 4,
						pointBackgroundColor: 'rgba(40, 167, 69, 1)',
						spanGaps: true,
					},
					{
						label: 'Real expense',
						data: realExpenses.reverse(),
						lineTension: 0,
						backgroundColor: 'transparent',
						borderColor: 'rgba(108, 117, 125, 0.7)',
						borderWidth: 4,
						pointBackgroundColor: 'rgba(108, 117, 125, 1)',
						spanGaps: true,
					},
					{
						label: 'Received',
						data: received.reverse(),
						lineTension: 0,
						backgroundColor: 'transparent',
						borderColor: 'rgba(231, 93, 0, 0.7)',
						borderWidth: 4,
						pointBackgroundColor: 'rgba(231, 93, 0, 1)',
						spanGaps: true,
					},
				],
			};

			const options = {
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						boxPadding: 3,
					},
				},
				responsive: true,
				maintainAspectRatio: false,
			};

			const ctx = document.getElementById('myChart');
			this.myChart = new Chart(ctx, {
				type: 'line',
				data,
				options,
			});
		},
	},

	mounted: async function () {
		await this.drawLinePlot();
	},

	watch: {
		expenses: {
			deep: true,
			handler() {
				toRaw(this.myChart).destroy();
				this.drawLinePlot();
			},
		},
	},
};

export default ExpenseLineChart;
