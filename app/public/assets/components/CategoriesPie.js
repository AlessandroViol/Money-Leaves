const { toRaw } = Vue;

const DoughnutChartExpense = {
	template: `
    <div class="" style="width: 100%; height: auto;">
      <canvas style="width: 100%; height: 100%;" id="doughnutChart"></canvas>
    </div>
  `,

	props: {
		expenses: {
			type: Array,
			required: true,
		},
	},

	data: function () {
		return {
			doughnutChart: null,
		};
	},

	methods: {
		countExpensesByCategory() {
			const categoryCounts = {};

			this.expenses.forEach((expense) => {
				const category = expense.category;
				if (!categoryCounts[category]) {
					categoryCounts[category] = 0;
				}
				categoryCounts[category] += 1;
			});

			return categoryCounts;
		},

		drawDoughnutChart() {
			const categoryCounts = this.countExpensesByCategory();

			const data = {
				labels: Object.keys(categoryCounts),
				datasets: [
					{
						label: 'Number of Expenses',
						data: Object.values(categoryCounts),
						backgroundColor: [
							'rgba(40, 167, 69, 1)',
							'rgba(111, 175, 49, 1)',
							'rgba(183, 184, 28, 1)',
							'rgba(255, 193, 7, 1)',
							'rgba(247, 160, 5, 1)',
							'rgba(239, 127, 2, 1)',
							'rgba(231, 93, 0, 1)',
						],
						borderColor: [
							'rgba(40, 167, 69, 1)',
							'rgba(111, 175, 49, 1)',
							'rgba(183, 184, 28, 1)',
							'rgba(255, 193, 7, 1)',
							'rgba(247, 160, 5, 1)',
							'rgba(239, 127, 2, 1)',
							'rgba(231, 93, 0, 1)',
						],
						borderWidth: 1,
					},
				],
			};

			const options = {
				cutoutPercentage: 80,
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						boxPadding: 3,
					},
				},
			};

			const ctx = document.getElementById('doughnutChart');
			this.doughnutChart = new Chart(ctx, {
				type: 'doughnut',
				data,
				options,
			});
		},
	},

	mounted: function () {
		this.drawDoughnutChart();
	},

	watch: {
		expenses: {
			deep: true,
			handler() {
				toRaw(this.doughnutChart).destroy();
				this.drawDoughnutChart();
			},
		},
	},
};

export default DoughnutChartExpense;
