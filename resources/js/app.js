var Vue = require('vue');
var store = require('./services/store');
var router = require('./services/router');

var app = new Vue({
    store,
    router,
    el :"#Ashlee-app",
    created()
    {
        if (document.getElementById("Ashlee-app").getAttribute('data-layout') !== "login") {
            this.$store.commit('getState', this.$api.state());
        }
    },
    computed: {
        loaded() {
            return ! this.$store.state.loading;
        }
    },
    components: {
        "ashlee-login-form" : require('../vue/forms/login.vue')
    }
});

if (module.hot) {
    module.hot.accept(function(err) {
        window.location.reload();
    });
}