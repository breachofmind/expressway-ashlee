var Vuex = require('vuex');

// A short time to wait to see the loading animation
// So it's not so jarring.
var STATE_LOAD_TIMEOUT = 500;

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
                setTimeout(function() {
                    state.loading = false;
                    state.currentUser = response.user;
                    state.objects = response.objects;
                    state.groups = response.groups;
                }, STATE_LOAD_TIMEOUT)
            });
        }
    }
});

module.exports = store;