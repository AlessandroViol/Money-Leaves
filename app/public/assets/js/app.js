import ThemeDropdown from '../components/ThemeDropdown.js';
import SignIn from '../components/SignIn.js';
import SignUp from '../components/SignUp.js';

const { createApp } = Vue;
const { createRouter, createWebHistory } = VueRouter;

const routes = [
	{ path: '/', component: SignIn },
	{ path: '/signup', component: SignUp },
];

const router = createRouter({ history: createWebHistory(), routes });

const app = createApp();
app.use(router);

//app.component('sign-in', SignIn);
app.component('theme-dropdown', ThemeDropdown);

// Mount the Vue application
app.mount('#app');
