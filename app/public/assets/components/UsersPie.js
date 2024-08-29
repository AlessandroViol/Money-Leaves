const { toRaw } = Vue;

const DoughnutChartContributors = {
	template: `
    <div style="width: 100%; height: 100%;">
      <canvas id="doughnutChartContributors"></canvas>
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
			doughnutChartContributors: null,
		};
	},

	methods: {
		countContributors() {
			const contributorCounts = {};

			this.expenses.forEach((expense) => {
				expense.contributors.forEach((contributor) => {
					const userId = contributor.user_id;
					if (userId !== this.username) {
						if (!contributorCounts[userId]) {
							contributorCounts[userId] = 0;
						}
						contributorCounts[userId] += 1;
					}
				});
			});

			return contributorCounts;
		},

		groupContributors(contributorCounts) {
			const sortedContributors = Object.entries(contributorCounts).sort((a, b) => b[1] - a[1]);

			if (sortedContributors.length > 6) {
				const topContributors = sortedContributors.slice(0, 6);
				const others = sortedContributors.slice(6);

				const othersCount = others.reduce((sum, contributor) => sum + contributor[1], 0);

				topContributors.push(['Others', othersCount]);

				return topContributors;
			}

			return sortedContributors;
		},

		drawDoughnutChart() {
			const contributorCounts = this.countContributors();
			const groupedContributors = this.groupContributors(contributorCounts);

			const labels = groupedContributors.map((contributor) => contributor[0]);
			const dataPoints = groupedContributors.map((contributor) => contributor[1]);

			const data = {
				labels: labels,
				datasets: [
					{
						label: 'Number of Contributions',
						data: dataPoints,
						backgroundColor: [
							'rgba(231, 93, 0, 1)',
							'rgba(239, 127, 2, 1)',
							'rgba(247, 160, 5, 1)',
							'rgba(255, 193, 7, 1)',
							'rgba(183, 184, 28, 1)',
							'rgba(111, 175, 49, 1)',
							'rgba(40, 167, 69, 1)',
						],
						borderColor: [
							'rgba(231, 93, 0, 1)',
							'rgba(239, 127, 2, 1)',
							'rgba(247, 160, 5, 1)',
							'rgba(255, 193, 7, 1)',
							'rgba(183, 184, 28, 1)',
							'rgba(111, 175, 49, 1)',
							'rgba(40, 167, 69, 1)',
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
				responsive: true,
				maintainAspectRatio: false,
			};

			const ctx = document.getElementById('doughnutChartContributors');
			this.doughnutChartContributors = new Chart(ctx, {
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
				toRaw(this.doughnutChartContributors).destroy();
				this.drawDoughnutChart();
			},
		},
	},
};

export default DoughnutChartContributors;
