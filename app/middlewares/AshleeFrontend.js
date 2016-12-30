"use strict";

var Middleware = require('expressway').Middleware;

class AshleeFrontend extends Middleware
{
    get description() {
        return  "Detects if user is logged in and can edit things on the frontend"
    }

    method(request,response,next,app)
    {
        if (request.user) {
            // Adds a bit of javascript to the frontend
            // that gives the current user page controls.
            response.view.use(function(view) {
                view.script('ashlee', app.alias('static') + 'frontend.js');
            });
        }
        next();
    }
}

module.exports = AshleeFrontend;