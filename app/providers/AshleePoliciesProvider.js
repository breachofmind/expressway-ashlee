var Provider = require('expressway').Provider

class AshleePoliciesProvider extends Provider
{
    constructor(app)
    {
        super(app);

        this.order = 16;
    }

    boot(next,app,gate,Policy)
    {
        /**
         * This policy governs the CRUD operations on all model objects.
         * @constructor
         */
        class ModelPolicy extends Policy
        {
            /**
             * Superuser check.
             * @param user User
             * @param ability string
             * @param model object
             * @returns {boolean}
             */
            before(user,ability,model) {
                if (user.is('superuser') || user.hasPermission('superuser')) {
                    return true;
                } else if (user.hasPermission(`${this.ref.name}.all`)) {
                    return true;
                }
            }
        }

        ['create','read','update','delete'].forEach(method => {
            /**
             * Add a method for each CRUD ability.
             * Checks if a user has the permission among their roles.
             * ie: "Model.edit"
             * @param user User
             * @param ability string
             * @param model object
             * @returns {*|boolean}
             */
            ModelPolicy.prototype[method] = function(user,ability,model) {
                return user.hasPermission(`${this.ref.name}.${ability}`);
            }
        });

        /**
         * Add the manage permission.
         * @param user User
         * @param ability string
         * @param model object
         * @returns {*}
         */
        ModelPolicy.prototype.manage = function(user,ability,model)
        {
            // Return true by default.
            let allow = true;

            if (this.ref.managed) {
                allow = user.hasPermission(`${this.ref.name}.${ability}`);
                if (model) {
                    let value = model[this.ref.managed];
                    if (value.id) value = value.id;
                    allow = value === user.id && allow;
                }
            }
            return allow;
        };

        app.models.each(model => {
            gate.define(model.name, new ModelPolicy(model));
        });

        next();
    }
}

module.exports = AshleePoliciesProvider;