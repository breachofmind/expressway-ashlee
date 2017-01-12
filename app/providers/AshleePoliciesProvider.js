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
            before(user,ability,model)
            {
                // Sorry, can't delete the superuser.
                if (this.ref.name == 'User' && ability == 'delete' && model.is('superuser')) {
                    return false;
                }
                // Sorry, can't delete yourself.
                if (this.ref.name == 'User' && ability == 'delete' && user.id == model.id) {
                    return false;
                }
                // Sorry, can't delete the superuser role.
                if (this.ref.name == 'Role' && ability == 'delete' && model.name == 'superuser') {
                    return false;
                }
                // Superuser can do anything.
                if (user.is('superuser') || user.hasPermission('superuser')) {
                    return true;
                }
                // User's with the Model.all permission can do anything in this model.
                if (user.hasPermission(`${this.ref.name}.all`)) {
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
            ModelPolicy.prototype[method] = function(user,ability,model)
            {
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
        ModelPolicy.prototype['manage'] = function(user,ability,model)
        {
            // Return true by default.
            let allow = true;

            // In a managed model, the managed property id
            // needs to match the user id.
            if (this.ref.managed)
            {
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