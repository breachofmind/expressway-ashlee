"use strict";

var expressway  = require('expressway');
var Model       = expressway.Model;

module.exports = function(app,customObject)
{
    class CustomObjectModel extends Model
    {
        /**
         * Constructor.
         */
        constructor()
        {
            super(app);

            this.expose = customObject.expose;
            this.slug = customObject.slug;
            this.title = customObject.title;
            this.table = this.table + "__c";
        }

        /**
         * Returns the name of the custom object.
         * @returns {String}
         */
        get name() {
            return customObject.name;
        }

        /**
         * Return the schema.
         * @param fields {FieldCollection}
         * @param types Object
         * @returns {void}
         */
        schema(fields,types)
        {
            fields.timestamps();
            if (! customObject.fields) {
                return;
            }

            customObject.fields.forEach(field =>
            {
                if (! field.active) return;

                let args = [types[field.type]];

                if (field.hasValidator('required') || field.name == this.title) {
                    args.push('required');
                }
                if (field.hasValidator('unique')) {
                    args.push('unique');
                }
                if (field.hasValidator('guarded')) {
                    args.push('guarded')
                }

                fields.add(field.name, args);
            });
        }
    }

    return CustomObjectModel;
};