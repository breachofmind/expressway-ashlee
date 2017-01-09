var Vue = require('vue');
var VueRouter = require('vue-router');
var store = require('./store');

var routes = {};
var router = new VueRouter(routes);


var app = new Vue({
    store,
    router,
    el :"#Ashlee-app",
    mounted()
    {
        this.$store.commit('getState', this.$api.state());
    },
    components: {
        'cms-table' : require('../vue/table/table.vue'),
        'current-user' : require('../vue/current-user.vue'),
        'nav-link' : require('../vue/nav-link.vue'),
        'nav-group' : require('../vue/nav-group.vue'),
    }
});
