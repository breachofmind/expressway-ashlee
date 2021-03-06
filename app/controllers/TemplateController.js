var _ = require('lodash');
var Controller = require('expressway').Controller;

class TemplateController extends Controller
{
    get description() {
        return "Handles all CMS-defined templates"
    }

    constructor(app)
    {
        super(app);

        this.middleware('default', 'AshleeFrontend');
    }

    /**
     * Return the default view.
     * @returns {View}
     */
    default(request,response,next,view)
    {
        return view;
    }

    /**
     * Modify a template slot.
     * POST /cms/template/:id/modify
     */
    modify(request,response,next,Template)
    {
        let update = request.body;

        return Template.findById(request.params.id).then(template =>
        {
            let slots = template.slots;
            let slot = template.slots[update.index];
            if (slot.name !== update.name) {
                return 400;
            }
            slots[update.index].content = update.content;
            return template.update({slots: slots}).then(done => {
                return 200;
            });
        });
    }

}

module.exports = TemplateController;