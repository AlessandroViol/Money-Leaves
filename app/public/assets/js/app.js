import ThemeDropdown from '../components/ThemeDropdown.js';
import SignIn from '../components/SignIn.js';

const { createApp } = Vue;

const app = createApp({});

app.component('sign-in', SignIn);

app.component('theme-dropdown', ThemeDropdown);

// Mount the Vue application
app.mount('#app');
