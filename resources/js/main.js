// Stylesheets
require('../scss/ashlee.scss');

var Vue         = require('vue');
var VueRouter   = require('vue-router');
var Vuex        = require('vuex');
var VeeValidate = require('vee-validate');
var VueAPI      = require('./api');

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueAPI);
Vue.use(VeeValidate, {
    errorBagName: 'v_errors',
    fieldsBagName: 'v_fields',
    delay:100,
});

// Components
Vue.component('icon', require('../vue/icon.vue'));
Vue.component('modal', require('../vue/modal.vue'));
Vue.component('snackbar', require('../vue/snackbar.vue'));
Vue.component('nav-link', require('../vue/nav-link.vue'));

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
