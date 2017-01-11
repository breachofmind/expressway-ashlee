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

            customObject.configureModel(this);
        }
    }

    return CustomObjectModel;
};