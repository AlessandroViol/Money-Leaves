import Expense from '../components/Expense.js';
import ThemeDropdown from '../components/ThemeDropdown.js';
import Icons from '../components/Icons.js';
import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';
import Main from '../components/Main.js';
import Topbar from '../components/Topbar.js';
import Sidebar from '../components/Sidebar.js';

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const routes = [
	{ path: '/', component: Main },
	{ path: '/signin', component: SignIn },
	{ path: '/signup', component: SignUp },
];

const router = createRouter({ history: createWebHistory(), routes });

const app = createApp();
app.use(router);

app.component('expense', Expense);
app.component('theme-dropdown', ThemeDropdown);
app.component('icons', Icons);
app.component('topbar', Topbar);
app.component('sidebar', Sidebar);

// Mount the Vue application
app.mount('#app');
