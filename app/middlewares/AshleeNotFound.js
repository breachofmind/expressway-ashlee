"use strict";

var Expressway = require('expressway');

class AshleeNotFound extends Expressway.Middleware
{
    get type() {
        return "AshleeCMSModule"
    }

    get description() {
        return  "The default 404 Not Found page for Ashlee CMS"
    }

    method(request,response,next)
    {
        return response.sendStatus(404);
    }
}

module.exports = AshleeNotFound;