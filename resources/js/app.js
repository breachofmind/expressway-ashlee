var Vue = require('vue');
var VueRouter = require('vue-router');
var store = require('./store');

var routes = [
    {path: "/",           component: require('../vue/views/home.vue')},
    {path: "/:model",     component: require('../vue/views/list.vue')},
    {path: "/:model/:id", component: require('../vue/views/edit.vue')},
];
var router = new VueRouter({routes});

var app = new Vue({
    store,
    router,
    el :"#Ashlee-app",
    created()
    {
        this.$store.commit('getState', this.$api.state());
    },
    computed: {
        loaded() {
            return ! this.$store.state.loading;
        }
    }
});
