var $http = require('axios');
var BASE = "/api/v1/";

class APIResource
{
    constructor(component)
    {
        this.$vue = component;
    }

    /**
     * Perform a GET action.
     * @param paths string|array
     * @param query object|null
     * @returns {Promise}
     */
    get(paths,query=null)
    {
        if (! Array.isArray(paths)) paths = [paths];
        let url = BASE + paths.join("/");
        return $http.get(url,query);
    }

    /**
     * Get the current user.
     * @returns {*|Promise.<TResult>|Promise<R>|Promise<R2|R1>}
     */
    currentUser()
    {
        return $http.get(BASE).then(response => {
            return response.data.currentUser;
        });
    }

    /**
     * Get a resource by name or id.
     * @param name string
     * @param id
     * @returns {*|Promise.<TResult>|Promise<R>|Promise<R2|R1>}
     */
    resource(name,id=null)
    {
        let args = id ? [name.toLowerCase(),id] : [name.toLowerCase()];
        return this.get(args).then(response => {
            return response.data;
        }, this.errorHandler('Error getting resource '+args.join("/")));
    }

    /**
     * Default error handler.
     * @param type
     * @returns {function(*)}
     */
    errorHandler(type,handler='$modal')
    {
        return (err) => {
            this.$vue[handler].alert(type+": "+err.message);
        }
    }

    /**
     * Vue.install method.
     * @param Vue
     * @param options
     */
    static install(Vue,options)
    {
        Object.defineProperties(Vue.prototype, {
            $api: {
                get: function() {
                    if (! this._api) this._api = new APIResource(this);
                    return this._api;
                }
            }
        });
    }
}

module.exports = APIResource;