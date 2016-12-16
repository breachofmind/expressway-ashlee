"use strict";

var Expressway = require('expressway');

class AshleeFrontend extends Expressway.Middleware
{
    get type() {
        return "AshleeCMSModule"
    }

    get description() {
        return  "Detects if user is logged in and can edit things on the frontend"
    }

    method(request,response,next)
    {
        if (request.user) {
            // Adds a bit of javascript to the frontend
            // that gives the current user page controls.
            response.viewData.push(function(view) {
                //TODO
                //view.script('ashlee', '/cms/static/frontend.js');
            })
        }
        next();
    }
}

module.exports = AshleeFrontend;