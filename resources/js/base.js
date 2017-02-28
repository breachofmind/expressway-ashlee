require('../scss/base.scss');

var components = {};
var routes = [];

window.ashlee = {
    components: {
        add(name, fn)
        {
            var func = fn;
            if (typeof fn !== 'function') {
                func = function callback(Vue) { return fn; };
            }
            return components[name] = func;
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
        },
        load(Vue)
        {
            this.each((name,fn) => {
                var cmp = fn.call(fn,Vue);
                Vue.component(name, cmp);
            });
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

module.exports = window.ashlee;