var Vue = require('vue');
var store = require('./store');

var app = new Vue({
    store,
    el :"#Ashlee-app",
    mounted()
    {
        this.$store.commit('getState', this.$api.state());
    },
    components: {
        'cms-table' : require('../vue/table/table.vue')
    }
});
