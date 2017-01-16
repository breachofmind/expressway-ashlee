"use strict";

var Component = require('../Component');

class Resource extends Component
{
    constructor(app)
    {
        super(app);

        this.label = "Resource";
        this.tip = "Retrieve a resource from the database";
    }

    /**
     * Render the component.
     * @param done Function
     * @param request IncomingMessage
     * @param response ServerResponse
     * @param next Function
     * @param data {Object}
     * @returns {String}
     */
    render(done,request,response,next,data)
    {
        let {model,id,template} = data;

        let Model = this.app.models.get(model);
        let filter = typeof id == 'string' ? {[Model.primaryKey]: id} : id;

        // Get the resource and render the template.
        Model.first(filter).then(resource => {
            app.root.render(template, {model:resource}).then(html => {
                return done(html);
            });
        });
    }

    /**
     * Return the Vue component for editing.
     * @returns {string}
     */
    input()
    {
        return `
            {
              name:"ResourceComponent",
            }
            `;
    }
}

module.exports = Resource;