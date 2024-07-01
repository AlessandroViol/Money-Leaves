import ThemeDropdown from '../components/ThemeDropdown.js';
import Icons from '../components/Icons.js';
import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';
import Main from '../components/Main.js';

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

//app.component('sign-in', SignIn);
app.component('theme-dropdown', ThemeDropdown);
app.component('icons', Icons);

// Mount the Vue application
app.mount('#app');
