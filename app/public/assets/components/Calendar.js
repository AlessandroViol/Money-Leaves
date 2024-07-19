const Calendar = {
	template: `
    <div class="dropdown-menu d-block position-static p-2 mx-0 shadow rounded-3 w-340px">
      <div class="d-grid gap-1">
        <div class="cal">
          <div class="cal-month d-flex justify-content-between align-items-center">
            <button class="btn cal-btn" type="button" @click="prevMonth">
              <svg class="bi" width="16" height="16"><use xlink:href="#arrow-left-short"/></svg>
            </button>
						<select class="form-select cal-month-select" v-model="currentMonth">
              <option v-for="(month, index) in monthNames" :key="month" :value="index">{{ month }}</option>
            </select>
            <select class="form-select cal-year-select" v-model="currentYear">
              <option v-for="year in yearRange" :key="year" :value="year">{{ year }}</option>
            </select>
            <button class="btn cal-btn" type="button" @click="nextMonth">
              <svg class="bi" width="16" height="16"><use xlink:href="#arrow-right-short"/></svg>
            </button>
          </div>
          <div class="cal-weekdays text-body-secondary">
            <div class="cal-weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
          </div>
          <div class="cal-days">
            <button
              class="btn cal-btn"
              v-for="day in daysInCalendar"
              :key="day.date"
              :class="{'text-muted': !day.isCurrentMonth}"
              type="button"
              @click="selectDate(day.date)"
            >{{ day.date.getDate() }}</button>
          </div>
        </div>
				<hr class="m-1"/>
				<div class="small text-secondary text-center h6">
					{{currentDate.getDate()}}/{{currentMonth+1}}/{{currentYear}}
				</div>
				<slot></slot>
      </div>
    </div>
  `,

	data() {
		return {
			monthNames: [
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
			],
			weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			selectedDate: null,

			currentDate: new Date(),
			currentMonth: new Date().getMonth(),
			currentYear: new Date().getFullYear(),
		};
	},

	computed: {
		currentMonthName() {
			return this.monthNames[this.currentMonth];
		},

		daysInMonth() {
			return new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
		},

		firstDayOfMonth() {
			return new Date(this.currentYear, this.currentMonth, 1).getDay();
		},

		prevMonthDays() {
			const prevMonthDate = new Date(this.currentYear, this.currentMonth, 0);
			const daysInPrevMonth = prevMonthDate.getDate();
			return Array.from({ length: this.firstDayOfMonth }, (_, i) => ({
				date: new Date(this.currentYear, this.currentMonth - 1, daysInPrevMonth - i),
				isCurrentMonth: false,
			})).reverse();
		},

		currentMonthDays() {
			return Array.from({ length: this.daysInMonth }, (_, i) => ({
				date: new Date(this.currentYear, this.currentMonth, i + 1),
				isCurrentMonth: true,
			}));
		},

		nextMonthDays() {
			const remainingDays = 42 - (this.prevMonthDays.length + this.currentMonthDays.length);
			return Array.from({ length: remainingDays }, (_, i) => ({
				date: new Date(this.currentYear, this.currentMonth + 1, i + 1),
				isCurrentMonth: false,
			}));
		},

		daysInCalendar() {
			return [...this.prevMonthDays, ...this.currentMonthDays, ...this.nextMonthDays];
		},

		yearRange() {
			const range = [];
			const currentYear = new Date().getFullYear();
			for (let i = 2020; i <= currentYear; i++) {
				range.push(i);
			}
			return range;
		},
	},

	methods: {
		prevMonth() {
			const date = new Date(this.currentYear, this.currentMonth - 1, 1);
			this.currentYear = date.getFullYear();
			this.currentMonth = date.getMonth();
		},

		nextMonth() {
			const date = new Date(this.currentYear, this.currentMonth + 1, 1);
			this.currentYear = date.getFullYear();
			this.currentMonth = date.getMonth();
		},

		selectDate(date) {
			this.currentDate = date;
			console.log('Selected Date:', this.currentDate);
		},
	},

	watch: {
		currentDate(val) {
			this.currentYear = val.getFullYear();
			this.currentMonth = val.getMonth();

			console.log('Date (calendar)', {
				day: this.currentDate.getDate(),
				month: this.currentMonth,
				year: this.currentYear,
			});
			this.$emit('updateDate', { day: this.currentDate.getDate(), month: this.currentMonth + 1, year: this.currentYear });
		},
	},

	emits: ['updateDate'],
};

export default Calendar;
