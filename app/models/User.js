"use strict";

var Model = require('expressway').Model;
var _     = require('lodash');

class User extends Model
{
    constructor(app,md5)
    {
        super(app);

        this.title      = 'email';
        this.expose     = false;
        this.populate   = ['roles'];
        this.managed    = true;

        // Create a pre-save hook that encrypts the password.
        this.hook((schema) => {
            schema.pre('save', function(next) {
                if (this.isModified('password')) {
                    this.password = this.encrypted(this.password);
                }
                next();
            });
        });

        this.on('toJSON', function(json,model,object) {
            json.name = object.name();
            json.imageUrl = "https://www.gravatar.com/avatar/"+md5(object.email.toLowerCase())
        });
    }

    /**
     * Create the user schema.
     * @param fields {FieldCollection}
     * @param types {{}}
     * @returns void
     */
    schema(fields,types)
    {
        fields
            .timestamps()
            .add('email',       types.Title,  'unique')
            .add('first_name',  types.String, 'required')
            .add('last_name',   types.String, 'required')
            .add('password',    types.String, 'guarded', 'required')
            .add('reset_token', types.String, 'guarded', {default:""})
            .add('failures',    types.Number, 'guarded', {default:0})
            .add('roles',       types.HasMany('Role'));
    }

    /**
     * Create the model methods.
     * @param object {Object}
     * @param config {Function}
     * @param encrypt {Function}
     * @param gate {Gate}
     * @returns {*}
     */
    methods(object,config,encrypt,gate)
    {
        let allowed_failures = config('allowed_login_failures', 0);

        let methods = {

            /**
             * Checks the hashed password and salt.
             * @param password string
             * @returns {boolean}
             */
            isValid(password)
            {
                if (! password) return false;

                return this.password === this.encrypted(password);
            },

            encrypted(password)
            {
                return encrypt(password,this.created_at.getTime().toString());
            },

            /**
             * Authenticate a user who is logging in.
             * @param password string
             * @throws string
             * @returns {boolean}
             */
            authenicate(password)
            {
                if (this.reset_token !== "") throw("pending_reset");
                if (allowed_failures && this.failures > allowed_failures) throw("too_many_failures");
                if (! password) throw("no_password");

                var valid = this.isValid(password);

                // Increment the failure count.
                if (valid === false) {
                    this.failures ++;
                    this.save();
                    throw ("bad_password");
                }
                // Reset the failure count.
                if (this.failures > 0) {
                    this.failures = 0;
                    this.save();
                }

                return valid;
            },

            /**
             * Return the user's full name.
             * @returns {string}
             */
            name()
            {
                return [this.first_name,this.last_name].join(" ");
            },

            /**
             * Check if a user has a role.
             * @param role string name
             * @returns {boolean}
             */
            is(role)
            {
                for (let i=0; i<this.roles.length; i++) {
                    if (this.roles[i].name.toLowerCase() == role) return true;
                }
                return false;
            },

            /**
             * Check if a user has a certain permission key.
             * @param key string
             * @returns {boolean}
             */
            hasPermission(key)
            {
                return this.permissions().indexOf(key) > -1;
            },

            /**
             * Return an array of this users permissions.
             * @returns {Array}
             */
            permissions()
            {
                let permissions = [];
                this.roles.map(function(role) {
                    permissions = _.union(role.permissions,permissions);
                });
                return permissions;
            },

            /**
             * Check if a user can perform an action.
             * @param ability string
             * @param object string|Model
             * @returns {boolean}
             */
            can(ability,object)
            {
                return gate.allows(this,ability,object);
            },

            /**
             * Alias of can()
             * @param ability string
             * @param object string|Model
             * @returns {boolean}
             */
            cannot(ability,object)
            {
                return ! this.can(ability,object);
            }
        };

        return super.methods(methods);
    }
}

module.exports = User;