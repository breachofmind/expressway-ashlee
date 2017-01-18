var VueRouter = require('vue-router');
var Vue = require('vue');

var routes = ashlee.routes.each((path,fn) => {
    return {
        path: path,
        component: fn(Vue)
    }

}).concat([
    {path: "/",           component: require('../../vue/views/home.vue'), name:"home"},
    {path: "/:model",     component: require('../../vue/views/list.vue'), name:"list"},
    {path: "/:model/:id", component: require('../../vue/views/edit.vue'), name:"edit"},
]);


var router = new VueRouter({routes});

module.exports = router;