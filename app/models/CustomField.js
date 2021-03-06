"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');
const LABELS = {
    label: "Label",
    author: "Author",
    display: "Displayed",
    fillable: "Fillable",
    object: "Object",
    name: "Name",
    type: "Type",
    priority: "Priority",
    validators: "Validators",
    options: "Options",
    value: "Value",
    tip: "Help tip"
}

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
        this.icon       = "av.library_books";
        this.singular   = "Custom Field";
        this.plural     = "Custom Fields";
        this.preview    = null;
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
            .add('display',    types.Boolean, 'fillable', 'display')
            .add('fillable',   types.Boolean, 'fillable', 'display')
            .add('object',     types.Text, 'required', 'fillable','display')
            .add('name',       types.Text, 'required', 'fillable','display')
            .add('type',       types.Text, 'required', 'fillable','display')
            .add('priority',   types.Number, {default:0}, 'fillable')
            .add('validators', types.StringArray)
            .add('options',    types.ObjectArray)
            .add('value',      types.Mixed)
            .add('tip',        types.Text, 'fillable')
            .labels(LABELS);
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

        /**
         * Add this custom field model to a Field instance.
         * @param model {Model}
         */
        methods.getFieldProperties = function(model)
        {
            let types = model.fields.types;

            let args = [
                types[this.type],
                (this.hasValidator('required') || this.name == model.title ? 'required' : null),
                (this.hasValidator('unique') ? 'unique' : null),
                (this.hasValidator('guarded') ? 'guarded' : null),
                (this.fillable ? 'fillable' : null),
                (this.display ? 'display' : null),
                {
                    label: this.label,
                    tip: this.tip,
                    priority: this.priority,
                }
            ];

            return args;
        };

        // This assures the base methods are not overwritten.
        return super.methods(methods);
    }
}

module.exports = CustomField;