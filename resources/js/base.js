require('../scss/base.scss');

var components = {};
var routes = [];

window.ashlee = {
    components: {
        add(name, fn)
        {
            return components[name] = fn;
        },
        toArray()
        {
            return Object.keys(components).map(key => {
                return {name: key, fn: components[key]}
            });
        },
        each(callback)
        {
            return this.toArray().map(cmp => {
                return callback(cmp.name,cmp.fn);
            })
        }
    },

    routes: {
        add(path, fn)
        {
            return routes.push({path: path, fn: fn});
        },
        each(callback)
        {
            return routes.map(route => {
                return callback(route.path,route.fn);
            });
        }
    }
};

require('./services/components');