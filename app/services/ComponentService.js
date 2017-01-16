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
         * @param response ServerResponse
         * @param next Function
         * @param objectArray {Array}
         * @param template Model
         * @returns {Promise<R>|Promise.<TResult>|Promise<R2|R1>}
         */
        render(request,response,next,objectArray=[])
        {
            let promises = objectArray.map((object,index) =>
            {
                let component = this.get(object.component);

                return new Promise(done => {
                    object.index = index;
                    if (response.view.data.template) {
                        object.templateId = response.view.data.template.id;
                    }
                    component.render(done,request,response,next,object);

                }).then(html => {
                    return {[object.name]: html}
                });
            });

            // Return the rendered component object.
            return Promise.all(promises).then(rendered =>
            {
                return _.assign({}, ...rendered);
            })
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