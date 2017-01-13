"use strict";

var ModelPolicy = require('./ModelPolicy');

class RolePolicy extends ModelPolicy
{
    constructor(Role)
    {
        super(Role);
    }

    before(test,user,ability,role)
    {
        switch(ability)
        {
            // Don't allow the user to
            // delete the superuser role.
            case 'delete' :
                if (role && role.name == 'superuser') {
                    return test.fail('auth.gate_canNotDeleteObject', [this.model.singular, role.name]);
                }
                break;

            // Do not allow user to change
            // the name of the superuser title.
            case 'update' :
                if (role && role.update.hasOwnProperty('name')) {
                    if (role.object.name == 'superuser' && role.update.name !== 'superuser') {
                        return test.fail('auth.gate_canNotModifyObject', [this.model.singular, role.object.name]);
                    }
                }
                break;
        }

        super.before(...arguments);
    }
}

module.exports = RolePolicy;