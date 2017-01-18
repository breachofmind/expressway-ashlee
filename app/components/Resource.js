"use strict";

var Component = require('../Component');
var _ = require('lodash');

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
        let {model,filter,template} = data;

        let Model = this.app.models.get(model);

        let filterName = Model.primaryKey;
        let filterValue = filter;

        // The parameter is part of the URL request.
        if (filter.startsWith(":")) {
            filterName = _.trimStart(filter,":");
            filterValue = request.params[filterName];
        } else if (filter.startsWith("?")) {
            filterName = _.trimStart(filter,"?");
            filterValue = request.query[filterName];
        }

        // If we're using an ID parameter, it should equal the model's primaryKey attribute.
        if (filterName == "id") filterName = Model.primaryKey;

        // Get the resource and render the template.
        Model.first({[filterName] : filterValue}).then(resource => {

            if (! resource) {
                return response.smart(404);
            }
            if (template) {
                return app.root.render(template, {model: resource}).then(html =>
                {
                    return done(html);
                });
            }

            return done(resource);
        });
    }
}

module.exports = Resource;