var Vuex = require('vuex');

var store = new Vuex.Store({
    state: {
        currentUser: null,
        definitions: {
            user: {
                title: 'email',
                fields: ['email','first_name','last_name'],
                labels: {
                    email: "Email",
                    first_name: "First Name",
                    last_name: "Last Name",
                },
            },
            media: {
                title:'file_name',
                fields: ['file_name','file_type'],
                labels: {
                    file_name: "File Name",
                    file_type: "Type",
                }
            }
        }
    },
    mutations: {
        getCurrentUser(state, api)
        {
            api.currentUser().then(user => {
                state.currentUser = user;
            });
        }
    }
});

module.exports = store;