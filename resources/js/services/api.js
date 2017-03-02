"use strict";
var axios = require('axios');

var $http = axios.create({
    baseURL: "/api/v1/",
    headers: {
        "Accept" : "application/vnd.api+json",
        "X-CSRF-TOKEN" : document.getElementById('CSRFTOKEN').getAttribute('content'),
        "X-REQUESTED-WITH" : "XMLHttpRequest"
    }
});

/**
 * Create a path given the args.
 * @param paths string|Array
 * @returns {*}
 * @private
 */
function __url(paths="")
{
    if (Array.isArray(paths)) {
        return paths.join("/");
    }
    return paths;
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
        return $http.get(__url(paths),{
            params: query,
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
        return $http.post(__url(paths), params);
    }

    /**
     * Update a record.
     * @param paths string|array
     * @returns {*}
     */
    put(paths,params=null)
    {
        return $http.put(__url(paths), params);
    }

    /**
     * Delete a record.
     * @param paths string|array
     * @param config object
     * @returns {*}
     */
    delete(paths,config=null)
    {
        return $http.delete(__url(paths),config);
    }



    /**
     * Perform a resource search.
     * @param slug string
     * @param params
     * @returns {Promise<R>|Promise.<TResult>|Promise<R2|R1>}
     */
    search(slug,params=null)
    {
        return this.post([slug,'search'], params).then(response => {
            return response.data;
        })
    }

    /**
     * Get the current user.
     * @returns {*|Promise.<TResult>|Promise<R>|Promise<R2|R1>}
     */
    currentUser()
    {
        return $http.get().then(response => {
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
            baseURL: "/",
        }).then(response => {
            return response.data;
        })
    }

    /**
     * Login in to the system.
     * @param credentials
     * @returns {Promise}
     */
    login(credentials)
    {
        return this.post("auth", credentials);
    }

    /**
     * Get a resource by name or id.
     * @param slug string
     * @param id
     * @returns {*|Promise.<TResult>|Promise<R>|Promise<R2|R1>}
     */
    resource(slug,id=null)
    {
        let args = id ? [slug,id] : [slug];
        return this.get(args).then(response => {
            return response.data;
        });
    }

    /**
     * Default error handler.
     * @param handler {String} $modal|$snack
     * @returns {function(*)}
     */
    errorHandler(handler='$snack')
    {
        return (err) => {
            var response = err.response.data;
            this.$vue[handler].alert(response.error.message);
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