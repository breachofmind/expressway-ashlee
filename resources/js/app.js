var Vue = require('vue');
var store = require('./services/store');
var router = require('./services/router');

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
