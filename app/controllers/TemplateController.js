var _ = require('lodash');
var Controller = require('expressway').Controller;

class TemplateController extends Controller
{
    get description() {
        return "Handles all CMS-defined templates"
    }

    /**
     * Return the default view.
     * @returns {View}
     */
    default(request,response,next,view)
    {
        return view;
    }

}

module.exports = TemplateController;