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
        components: [],
        lastFormSaved: null,
        lastRecordDeleted: null,
    },
    mutations: {
        getState(state, promise)
        {
            state.loading = true;
            promise.then(response =>
            {
                let objectMap = response.objects.map(object => { return new Model(object) });

                setTimeout(function() {
                    state.loading = false;
                    state.currentUser = response.user;
                    state.objects = arrayToObject(objectMap, item => {
                        return item.slug;
                    });
                    state.groups = response.groups;
                    state.components = response.components;

                }, STATE_LOAD_TIMEOUT)
            });
        },
        deleteRecord(state,data)
        {
            state.lastRecordDeleted = data;
        },
        formSaved(state, data)
        {
            state.lastFormSaved = data;
        },
        tableUpdate(state,slug)
        {
            return slug;
        }
    },
    getters: {
        objectArray(state)
        {
            return Object.keys(state.objects).map(key => {
                return state.objects[key];
            })
        }
    }
});

function arrayToObject(arr, keyFn)
{
    var out = {};
    arr.forEach(item => {
        out[keyFn(item)] = item;
    });
    return out;
}

class Model {
    constructor(object)
    {
        Object.keys(object).forEach(key => {
            this[key] = object[key];
        });
    }
    
    get hasSlugField()
    {
        var yes = false;
        this.fields.forEach(field => {
            if (field.typeName == 'Slug') return yes = true;
        });
        return yes;
    }
    
    getFields(type) {
        var fields = [];
        this.fields.forEach(field => {
            if (field[type] === true) fields.push(field);
        });
        return fields;
    }
}

module.exports = store;