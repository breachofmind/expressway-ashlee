"use strict";

var ObjectCollection = require('expressway/src/ObjectCollection');
var Component = require('../Component');
var Promise = require('expressway').Promise;
var _ = require('lodash');

module.exports = function(app,debug)
{
    return new class ComponentService extends ObjectCollection
    {
        constructor()
        {
            super(app,'component');

            this.class = Component;

            this.on('add', (name,value) => {
                debug('ComponentService added: %s',name);
            });
        }

        /**
         * Given the request and component object data,
         * render each component instance and return a promise.
         * @param request IncomingMessage
         * @param objectArray {Array}
         * @returns {Promise}
         */
        render(request,objectArray=[])
        {
            let promises = objectArray.map((object,index) =>
            {
                let component = this.get(object.component);

                return new Promise(resolve => {
                    object.index = index;
                    app.call(component,'render', [resolve,request,object]);

                }).then(returnResult => {
                    if (returnResult instanceof Error || returnResult instanceof ApplicationCallError) {
                        throw returnResult;
                    }
                    // Result could be html text or object.
                    return {[object.name]: returnResult};
                });
            });

            // Return the rendered component object.
            return Promise.all(promises).then(rendered => {
                return _.assign({}, ...rendered);
            });
        }

        /**
         * Create and add a custom component.
         * @param name {String}
         * @param object {Object}
         * @returns {ComponentService}
         */
        create(name, object)
        {
            let CustomComponent = Component.extend(name,object);

            return this.add(name,CustomComponent);
        }
    }
};