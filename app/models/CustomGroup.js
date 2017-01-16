"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

const LABELS = {
    name: "Name",
    author: "Author",
    color: "Color",
    objects: "Objects",
    active: "Active"
};

class CustomGroup extends Model
{
    /**
     * Constructor.
     * @injectable
     * @param app Application
     */
    constructor(app)
    {
        super(app);

        this.title      = 'name';
        this.expose     = true;
        this.managed    = "author";
        this.icon       = "image.filter_none";
        this.singular   = "Custom Group";
        this.plural     = "Custom Groups";
        this.preview    = null;
    }

    /**
     * Return the schema fields.
     * @returns {Object}
     */
    schema(fields,types)
    {
        fields
            .slug()
            .timestamps()
            .add('name',   types.Title)
            .add('author', types.User)
            .add('color',  types.Color,'display','fillable')
            .add('objects', types.StringArray)
            .add('active', types.Boolean, 'fillable', 'display')
            .labels(LABELS);

    }

    /**
     * Return the schema methods.
     * @returns {Object}
     */
    methods(object)
    {
        // This assures the base methods are not overwritten.
        return super.methods(object);
    }
}

module.exports = CustomGroup;