import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.ignoredElements = ['iconizza-icon'];

new Vue({
	render: (h) => h(App),
}).$mount('#app');
