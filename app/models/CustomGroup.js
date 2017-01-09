"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

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
        this.populate   = ['objects'];
        this.managed    = "author";

        this.hook(schema => {
            schema.virtual('objects', {
                ref: "CustomObject",
                localField: "slug",
                foreignField: "group"
            });
        })

        this.on('toJSON', function(json,model,object) {
            json.objects = object.objects;
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
            .add('author', types.User)
            .add('active', types.Boolean)
            .add('name',   types.Title);
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