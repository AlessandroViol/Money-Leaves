import Expense from '../components/Expense.js';
import ThemeDropdown from '../components/ThemeDropdown.js';
import Icons from '../components/Icons.js';
import Topbar from '../components/Topbar.js';
import Sidebar from '../components/Sidebar.js';
import ExpenseLineChart from '../components/ExpenseLineChart.js';

import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';
import Main from '../components/Main.js';
import ErrorLandingScreen from '../components/ErrorLandingScreen.js';
import UserDetails from '../components/UserDetails.js';

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const routes = [
	{ path: '/', component: Main },
	{ path: '/signin', component: SignIn },
	{ path: '/signup', component: SignUp },
	{ path: '/error/:description', component: ErrorLandingScreen },
	{ path: '/user/:otherUsername', component: UserDetails },
];

const router = createRouter({ history: createWebHistory(), routes });

const app = createApp();
app.use(router);

app.component('expense', Expense);
app.component('theme-dropdown', ThemeDropdown);
app.component('icons', Icons);
app.component('topbar', Topbar);
app.component('sidebar', Sidebar);
app.component('expense-line-chart', ExpenseLineChart);

// Mount the Vue application
app.mount('#app');
