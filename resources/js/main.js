// Stylesheets
require('../scss/ashlee.scss');

var Vue         = require('vue');
var VueRouter   = require('vue-router');
var Vuex        = require('vuex');
var VueAPI      = require('./services/api');

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueAPI);

// Components
var componentMap = {
    "icon"                  : 'icon.vue',
    "modal"                 : 'modal.vue',
    "snackbar"              : 'snackbar.vue',
    "nav-link"              : 'nav-link.vue',
    "dropdown-menu"         : "dropdown-menu.vue",
    "layout-sidebar"        : "views/layout/sidebar.vue",
    "layout-header"         : "views/layout/header.vue",
    "layout-body-header"    : "views/layout/body-header.vue",
    "layout-page-container" : "views/layout/page-container.vue",
    "component-slot-header" : "forms/component-slot-header.vue",
};

Object.keys(componentMap).forEach(key => {
    Vue.component(key, require('../vue/'+componentMap[key]));
});

// Input components
var inputTypes = [
    'Boolean',
    'Email',
    'Slug',
    'Text',
    'URL',
    'Password',
    'Color',
    'Number',
    'ComponentSlots',
];
inputTypes.forEach(type => {
    Vue.component('Input'+type, require('../vue/inputs/'+type+".vue"));
});

// Create custom component slot components.
window.ashlee.components.each((name,fn) =>
{
    var obj = fn.call(fn,Vue);
    obj.props = ['options','index'];
    obj.name = name;
    Vue.component(name, obj);
});

require('./app');

if (module.hot) {
    // Causes the hot reloader to refresh page on error
    module.hot.accept('./app', function(err,updates) {
        if (err) window.location.reload();
    });
}
