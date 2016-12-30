"use strict";

var Middleware = require('expressway').Middleware;

class AshleeNotFound extends Middleware
{
    get description() {
        return  "The default 404 Not Found page for Ashlee CMS"
    }

    method(request,response,next)
    {
        return response.sendStatus(404);
    }
}

module.exports = AshleeNotFound;