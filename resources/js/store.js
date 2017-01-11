var Vuex = require('vuex');

var store = new Vuex.Store({
    state: {
        loading: true,
        currentUser: {},
        objects: {},
        groups: {},
        view: "dashboard"
    },
    mutations: {
        getState(state, promise)
        {
            state.loading = true;
            promise.then(response => {
                state.loading = false;
                state.currentUser = response.user;
                state.objects = response.objects;
                state.groups = response.groups;
            });
        }
    }
});

module.exports = store;