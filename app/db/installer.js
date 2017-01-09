"use strict";
var path = require('path');

module.exports = function(app,seeder,permissions)
{
    // A couple of basic roles.
    // Add as many custom roles as you please.
    let roles = [
        {
            name: 'superuser',
            description: "Has system-wide permissions.",
            permissions: ['superuser']
        },
        {
            name: 'manager',
            description: "Has permission to add, edit and delete media.",
            permissions: ['Media.all']
        }
    ];

    let customGroups = [
        {
            name: "System",
            slug: "system",
        },
        {
            name:"Custom Objects",
            slug:"custom-objects",
        }
    ];

    let installer = seeder.add('cms', {
        path: path.resolve(__dirname, 'seeds') + "/",
        parsed(data,seeder)
        {
            var admin = data.User[0];

            // Use this opportunity between seeding to assign some relationships.
            // Assign the users their appropriate roles.
            data.User[0].roles = [data.Role[0]._id];
            data.User[1].roles = [data.Role[1]._id];
            data.CustomGroup.map(row => {
                row.author = admin._id;
            });
            data.CustomField.map(row => {
                row.author = admin._id;
            });
            data.CustomObject.forEach(row => {
                row.author = admin._id;
            });
        }
    });

    installer.add('User', 'users.csv');
    installer.add('Role', roles);
    installer.add('CustomGroup', customGroups);
    installer.add('CustomObject', 'objects.csv');
    installer.add('CustomField', 'fields.csv');
};