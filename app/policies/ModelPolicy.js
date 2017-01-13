"use strict";

var Policy = require('expressway-auth/src/Policy');

/**
 * This policy governs the CRUD operations on all model objects.
 * @constructor
 */
class ModelPolicy extends Policy
{
    constructor(model)
    {
        super();

        /**
         * The model blueprint being referenced.
         * @type {Model}
         */
        this.model = model;
    }

    /**
     * Check if the user is a superuser.
     * @param user User
     * @returns {*|Boolean|boolean}
     * @private
     */
    _isSuperUser(user)
    {
        return user.is('superuser') || user.hasPermission('superuser');
    }

    /**
     * Superuser check.
     * @param test PolicyTest
     * @param user User
     * @param ability string
     * @param model object
     * @returns {boolean}
     */
    before(test,user,ability,model)
    {
        // Superuser can do anything.
        if (this._isSuperUser(user)) {
            return test.pass("auth.gate_is_superuser");
        }
        // User's with the Model.all permission can do anything in this model.
        if (user.hasPermission(`${this.model.name}.all`)) {
            return test.pass("auth.gate_can_all", [this.model.plural]);
        }
    }

    /**
     * Add the manage permission.
     * @param test PolicyTest
     * @param user User
     * @param ability string
     * @param model object
     * @returns {*}
     */
    manage(test,user,ability,model)
    {
        // In a managed model, the managed property id
        // needs to match the user id.
        if (this.model.managed)
        {
            // The need the 'manage' permission to continue.
            if (! user.hasPermission(`${this.model.name}.manage`)) {
                return test.fail('auth.gate_cannot_manage', [this.model.plural]);
            }
            if (model) {
                let objectUserId = model[this.model.managed];
                if (objectUserId.id) objectUserId = objectUserId.id;
                if (objectUserId !== user.id) {
                    return test.fail('auth.gate_cannot_manage_object', [this.model.singluar, model[this.model.title]]);
                }
            }
        }
        // Congrats, you can manage this object.
        return test.pass('auth.gate_can_manage', [this.model.plural]);
    }
}


['create','read','update','delete'].forEach(method =>
{
    /**
     * Add a method for each CRUD ability.
     * Checks if a user has the permission among their roles.
     * ie: "Model.edit"
     * @param test {PolicyTest}
     * @param user {User}
     * @param ability {String}
     * @param model {object}
     * @returns {*|boolean}
     */
    ModelPolicy.prototype[method] = function(test,user,ability,model)
    {
        if (user.hasPermission(`${this.model.name}.${ability}`)) {
            return test.pass('auth.gate_can_'+ability, [this.model.plural]);
        }
        return test.fail('auth.gate_cannot_'+ability, [this.model.plural]);
    }
});


module.exports = ModelPolicy;