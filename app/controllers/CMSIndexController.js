var Expressway = require('expressway');

class CMSIndexController extends Expressway.Controller
{
    constructor()
    {
        super();
    }

    index(request,response,next,view)
    {
        return "Hello from Ashlee";
    }
}

module.exports = CMSIndexController;