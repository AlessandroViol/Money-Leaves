const { toRaw } = Vue;

const ExpenseLineChart = {
	template: `
    <canvas class="mb-4 w-100" id="myChart" width="900" height="380"></canvas>
  `,

	props: {
		expenses: {
			type: Array,
			required: true,
		},
	},

	data: function () {
		return {
			myChart: null,
		};
	},

	methods: {
		drawLinePlot() {
			const data = {
				labels: this.expenses.map(
					(expense) => expense.date.day.toString() + '/' + expense.date.month.toString() + '/' + expense.date.year.toString()
				),
				datasets: [
					{
						data: this.expenses.map((expense) => expense.total_cost),
						lineTension: 0,
						backgroundColor: 'transparent',
						borderColor: '#28a745',
						borderWidth: 4,
						pointBackgroundColor: '#28a745',
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
