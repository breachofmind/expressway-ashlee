// Stylesheets
require('../scss/ashlee.scss');

var Vue         = require('vue');
var VueRouter   = require('vue-router');
var Vuex        = require('vuex');
var VueAPI      = require('./api');

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueAPI);

// Components
Vue.component('icon', require('../vue/icon.vue'));
Vue.component('modal', require('../vue/modal.vue'));
Vue.component('snackbar', require('../vue/snackbar.vue'));
Vue.component('nav-link', require('../vue/nav-link.vue'));
Vue.component('dropdown-menu', require('../vue/dropdown-menu.vue'));
Vue.component('layout-sidebar', require('../vue/views/layout/sidebar.vue'));
Vue.component('layout-header', require('../vue/views/layout/header.vue'));
Vue.component('layout-body-header', require('../vue/views/layout/body-header.vue'));
Vue.component('layout-page-container', require('../vue/views/layout/page-container.vue'));


// Input components
var inputTypes = [
    'Boolean',
    'Email',
    'Slug',
    'Text',
    'URL',
    'Password'
];
inputTypes.forEach(type => {
    Vue.component('Input'+type, require('../vue/inputs/'+type+".vue"));
});

require('./app');

if (module.hot) {
    // Causes the hot reloader to refresh page on error
    module.hot.accept('./app', function(err,updates) {
        if (err) window.location.reload();
    });
}
