"use strict";

var ModelPolicy = require('./ModelPolicy');

class UserPolicy extends ModelPolicy
{
    constructor(User)
    {
        super(User);
    }

    before(test,user,ability,model)
    {
        switch(ability)
        {
            case 'delete' :
                // You can't delete the superuser or yourself.
                if (model && (model.is('superuser') || user.id == model.id)) {
                    return test.fail('auth.gate_canNotModifyObject', [this.model.singular, user.email]);
                }
                break;
        }

        super.before(...arguments);
    }
}

module.exports = UserPolicy;