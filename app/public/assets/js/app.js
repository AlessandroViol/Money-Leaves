import ExpenseListItem from '../components/ExpenseListItem.js';
import ThemeDropdown from '../components/ThemeDropdown.js';
import Icons from '../components/Icons.js';
import Topbar from '../components/Topbar.js';
import Sidebar from '../components/Sidebar.js';
import ExpenseLineChart from '../components/ExpenseLineChart.js';
import ExpenseList from '../components/ExpenseList.js';
import Balance from '../components/Balance.js';
import QuickRefoundButton from '../components/QuickRefoundButton.js';
import Expense from '../components/Expense.js';
import ExpenseDate from '../components/ExpenseDate.js';
import Calendar from '../components/Calendar.js';
import ExpenseForm from '../components/ExpenseForm.js';

import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';
import Main from '../components/Main.js';
import ErrorLandingScreen from '../components/ErrorLandingScreen.js';
import UserDetails from '../components/UserDetails.js';
import Users from '../components/Users.js';
import CreateExpense from '../components/CreateExpense.js';

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const routes = [
	{ path: '/', component: Main },
	{ path: '/signin', component: SignIn },
	{ path: '/signup', component: SignUp },
	{ path: '/error/:description', component: ErrorLandingScreen },
	{ path: '/user/:otherUsername', component: UserDetails },
	{ path: '/users', component: Users },
	{ path: '/create', component: CreateExpense },
];

const router = createRouter({ history: createWebHistory(), routes });

const app = createApp();
app.use(router);

app.component('theme-dropdown', ThemeDropdown);
app.component('icons', Icons);
app.component('topbar', Topbar);
app.component('sidebar', Sidebar);
app.component('balance', Balance);
app.component('expense-line-chart', ExpenseLineChart);
app.component('expense-date', ExpenseDate);
app.component('expense-list', ExpenseList);
app.component('expense-list-item', ExpenseListItem);
app.component('expense', Expense);
app.component('quick-refound-button', QuickRefoundButton);
app.component('calendar', Calendar);
app.component('expense-form', ExpenseForm);

// Mount the Vue application
app.mount('#app');
