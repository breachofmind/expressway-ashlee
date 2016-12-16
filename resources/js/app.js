var Vue = require('vue');
var store = require('./store');

var app = new Vue({
    store,
    el :"#Ashlee-app",
    data: {
        user:null,
    },
    mounted()
    {
        this.$store.commit('getCurrentUser', this.$api);
    },
    components: {
        'cms-table' : require('../vue/table/table.vue')
    }
});
