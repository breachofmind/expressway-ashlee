"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

class CustomObject extends Model
{
    /**
     * Constructor.
     * @injectable
     * @param app {Application}
     * @param url {URLService}
     */
    constructor(app,url)
    {
        super(app);

        this.title      = 'name';
        this.expose     = true;
        this.populate   = ['fields'];
        this.managed    = "author";

        this.hook(schema => {
            schema.virtual('fields', {
                ref: "CustomField",
                localField: "slug",
                foreignField: "object"
            });
        });

        this.on('toJSON', function(json,model,object) {
            json.$api = url.api(object.slug);
            json.fields = object.fields;
        });
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
            .add('active', types.Boolean)
            .add('expose', types.Boolean)
            .add('group',  types.String, 'required', {default:'custom-objects'})
            .add('icon',   types.String, 'required', {default:"action.class"})
            .add('title',  types.String, 'required')
            .add('tip',    types.String);
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

module.exports = CustomObject;