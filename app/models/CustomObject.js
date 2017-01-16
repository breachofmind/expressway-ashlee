"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

const LABELS = {
    name:    "Name",
    author:  "Author",
    active:  "Active",
    expose:  "Public",
    icon:    "Icon",
    title:   "Title Field",
    tip:     "Help tip",
    preview: "Preview Image",
};

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
        this.preview    = null;

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
            .add('name',    types.Title)
            .add('author',  types.User)
            .add('active',  types.Boolean, 'fillable')
            .add('expose',  types.Boolean, 'fillable', 'display')
            .add('icon',    types.Text, 'required', {default:"action.class"}, 'fillable')
            .add('title',   types.Text, 'required', 'fillable','display')
            .add('tip',     types.Text, 'fillable')
            .add('preview', types.URL, 'fillable')
            .labels(LABELS);
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
                ['expose','icon','title','tip','preview'].forEach(property => {
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