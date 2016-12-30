var Vuex = require('vuex');

var store = new Vuex.Store({
    state: {
        loading: true,
        currentUser: null,
        definitions: {}
    },
    mutations: {
        getState(state, promise)
        {
            state.loading = true;
            promise.then(response => {
                state.loading = false;
                state.user = response.user;
                state.definitions = response.defs;
            });
        }
    }
});

module.exports = store;