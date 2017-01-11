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
        this.icon       = "av.library_add";
        this.singular   = "Custom Object";
        this.plural     = "Custom Objects";

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
            .add('active', types.Boolean, 'fillable')
            .add('expose', types.Boolean, 'fillable')
            .add('group',  types.Text, 'required', {default:'custom-objects'}, 'fillable')
            .add('icon',   types.Text, 'required', {default:"action.class"}, 'fillable')
            .add('title',  types.Text, 'required', 'fillable')
            .add('tip',    types.Text, 'fillable');
    }

    /**
     * Return the schema methods.
     * @returns {Object}
     */
    methods(methods)
    {
        /**
         * Configure a model with new settings and fields.
         * @param model Model
         * @param overwriteBaseProps {Boolean}
         */
        methods.configureModel = function(model, overwriteBaseProps=true)
        {
            if (overwriteBaseProps) {
                ['expose','group','icon','title','tip'].forEach(property => {
                    model[property] = this[property];
                });
            }


            if (this.fields) {
                this.fields.forEach(customField =>
                {
                    let props = customField.getFieldProperties(model);
                    if (model.fields.has(customField.name)) {
                        return model.fields.get(customField.name).use(props);
                    }

                    return model.fields.add(customField.name, props);
                })
            }
        };

        // This assures the base methods are not overwritten.
        return super.methods(methods);
    }
}

module.exports = CustomObject;