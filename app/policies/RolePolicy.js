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
            case 'update' :
            case 'delete' :
                if (role && role.name == 'superuser') {

                    return test.fail('auth.gate_canNotModifyObject', [this.model.singular, role.name]);
                }
                break;
        }

        super.before(...arguments);
    }
}

module.exports = RolePolicy;