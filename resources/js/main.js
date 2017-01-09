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


require('./app');

if (module.hot) {
    // Causes the hot reloader to refresh page on error
    module.hot.accept('./app', function(err,updates) {
        if (err) window.location.reload();
    });
}
