var Provider = require('expressway').Provider

class AshleePoliciesProvider extends Provider
{
    constructor(app)
    {
        super(app);

        this.order = 16;

        /**
         * The default model policy.
         * @type {ModelPolicy}
         */
        this.defaultPolicy = require('../policies/ModelPolicy');

        /**
         * Policies governing other models.
         * @type {{Role: RolePolicy, User: UserPolicy}}
         */
        this.policyMap = {
            "Role" : require('../policies/RolePolicy'),
            "User" : require('../policies/UserPolicy'),
        }
    }

    /**
     * Assign the policies to each model.
     * @param next Function
     * @param app Application
     * @param gate Gate
     */
    boot(next,app,gate)
    {
        let DefaultPolicyClass = this.defaultPolicy;

        app.models.each(model =>
        {
            if (this.policyMap[model.name]) {
                let PolicyClass = this.policyMap[model.name];
                return gate.define(model.name, new PolicyClass(model));
            }

            return gate.define(model.name, new DefaultPolicyClass(model));
        });

        next();
    }
}

module.exports = AshleePoliciesProvider;