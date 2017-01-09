var _   = require('lodash');
var Model = require('expressway').Model;

class Role extends Model
{
    constructor(app)
    {
        super(app);

        this.title = 'name';
        this.expose = false;
    }

    /**
     * Create the role schema.
     * @param fields {FieldCollection}
     * @param types {Object}
     */
    schema(fields,types)
    {
        fields
            .timestamps()
            .add('name',        types.Title)
            .add('description', types.String)
            .add('permissions', types.StringArray);

    }

    /**
     * Create the role model methods.
     * @param object {Object}
     * @returns {Object}
     */
    methods(object)
    {
        let methods = {
            /**
             * Assign a permission.
             * @param permission {String}
             */
            assign: function (permission)
            {
                this.permissions = this.permissions.push(permission);
                this.save();
            },

            /**
             * Unassign a permission.
             * @param permission {String}
             */
            unassign: function(permission)
            {
                this.permissions = _.filter(this.permissions, function(currentPermission) {
                    return currentPermission != permission;
                });
                this.save();
            }
        };

        return super.methods(methods);
    }
}

module.exports = Role;