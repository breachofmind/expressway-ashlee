"use strict";

var Middleware = require('expressway').Middleware;

class AshleeFrontend extends Middleware
{
    get description() {
        return  "Detects if user is logged in and can edit things on the frontend"
    }

    method(request,response,next,url,cms)
    {
        response.view.meta('generator', 'Expressway Ashlee CMS v.'+cms.package.version);

        if (request.user) {
            // Adds a bit of javascript to the frontend
            // that gives the current user page controls.
            response.view.script('ashlee', url.cms('static/frontend.js'));
        }
        next();
    }
}

module.exports = AshleeFrontend;