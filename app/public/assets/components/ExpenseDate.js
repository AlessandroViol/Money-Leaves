const ExpenseDate = {
	template: `
    <span class="small opacity-75">{{ dateObjToString(this.date) }}</span>
  `,

	props: {
		date: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {};
	},

	methods: {
		dateObjToString(date, fullMonth = false) {
			if (date === undefined) {
				return;
			}

			const fullMonthLabel = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December',
			];
			const monthLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
			const month = fullMonth ? fullMonthLabel : monthLabel;
			const dateStr = `${date.day}/${month[date.month - 1]}/${date.year}`;
			return dateStr;
		},
	},
};

export default ExpenseDate;
