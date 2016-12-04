var Expressway = require('expressway');

class CMSIndexController extends Expressway.Controller
{
    get description() {
        return "Handles all Ashlee CMS requests"
    }

    index(request,response,next,view)
    {
        return view("$cms:index");
    }
}

module.exports = CMSIndexController;