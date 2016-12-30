"use strict";

var $http = require('axios');
var BASE = "/api/v1/";
var DEFAULT_HEADERS = {
    "X-CSRF-TOKEN" : document.getElementById('CSRFTOKEN').getAttribute('content'),
    "X-REQUESTED-WITH" : "XMLHttpRequest"
};

function getUrl(paths)
{
    if (! Array.isArray(paths)) paths = [paths];
    return BASE + paths.join("/");

}

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
        return $http.get(getUrl(paths),{
            params: query,
            headers: DEFAULT_HEADERS
        });
    }

    /**
     * Post to the API.
     * @param paths string|array
     * @param params object
     * @returns {Promise}
     */
    post(paths,params=null)
    {
        return $http.post(getUrl(paths), params, {
            headers: DEFAULT_HEADERS
        });
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
     * Get the CMS state object.
     * @returns {Promise}
     */
    state()
    {
        return $http.post("/cms/_state", {}, {
            headers: DEFAULT_HEADERS
        }).then(response => {
            return response.data;
        })
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