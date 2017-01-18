"use strict";

var _ = require('lodash');
var utils = require('expressway/src/support/utils');

class Component
{
    constructor(app)
    {
        /**
         * The Application instance.
         * @type {Application}
         */
        this._app = app;

        /**
         * The component human-readable label.
         * @type {String}
         */
        this.label = this.name;

        /**
         * A description of the component.
         * @type {String}
         */
        this.tip = "Custom component";
    }

    /**
     * Get the protected Application instance.
     * @returns {Application}
     */
    get app()
    {
        return this._app;
    }

    /**
     * Get the component name.
     * @returns {String}
     */
    get name()
    {
        return this.constructor.name;
    }

    /**
     * Render the component in context.
     * @param next Function
     * @param request IncomingMessage
     * @param data object
     */
    render(next,request,data)
    {
        throw new Error(this.name+'.render() unimplemented');
    }

    /**
     * Create a wrapper for the rendered content.
     * @param attr
     * @returns {*}
     */
    element(attr)
    {
        return utils.element('div', attr);
    }

    /**
     * Convert this object to a JSON.
     * @returns {{}}
     */
    toJSON()
    {
        let out = {};
        ['name','label','tip'].forEach(property => {
            out[property] = this[property];
        });
        return out;
    }

    /**
     * Factory method for creating a component.
     * @param name {String}
     * @param object {Object}
     * @returns {CustomComponent}
     */
    static extend(name,object)
    {
        class CustomComponent extends Component
        {
            constructor(app)
            {
                super(app);

                if (object.constructor) {
                    object.constructor.call(this, ...arguments);
                }
            }

            get name()
            {
                return name;
            }
        }

        _.each(object, (value,key) =>
        {
            if (['constructor'].indexOf(key) > -1) return;

            CustomComponent.prototype[key] = value;
        });

        return CustomComponent;
    }
}

module.exports = Component;