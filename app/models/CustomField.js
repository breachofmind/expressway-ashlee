"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

class CustomField extends Model
{
    /**
     * Constructor.
     * @injectable
     * @param app Application
     */
    constructor(app)
    {
        super(app);

        this.title      = 'label';
        this.expose     = true;
        this.managed    = "author";
    }

    /**
     * Return the schema fields.
     * @returns {Object}
     */
    schema(fields,types)
    {
        fields
            .timestamps()
            .add('label',      types.Title)
            .add('author',     types.User)
            .add('active',     types.Boolean)
            .add('display',    types.Boolean)
            .add('object',     types.String, 'required')
            .add('name',       types.String, 'required')
            .add('type',       types.String, 'required')
            .add('priority',   types.Number, {default:0})
            .add('validators', types.StringArray)
            .add('options',    types.ObjectArray)
            .add('value',      types.Mixed)
            .add('tip',        types.String)
    }

    /**
     * Return the schema methods.
     * @returns {Object}
     */
    methods(methods)
    {
        /**
         * Check if a validator is given.
         * @param name string
         * @returns {boolean}
         */
        methods.hasValidator = function(name) {
            return this.validators.indexOf(name) > -1;
        };
        // This assures the base methods are not overwritten.
        return super.methods(methods);
    }
}

module.exports = CustomField;