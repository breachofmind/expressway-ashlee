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
     * @param done {Function}
     * @param request {IncomingMessage}
     * @param data {Object}
     * @returns {String}
     */
    render(done,request,data,config)
    {
        let {model,filter,template} = data;

        let Model = this.app.models.get(model);

        // Get the resource and render the template.
        Model.first(getFilterObject(Model,request,filter)).then(resource =>
        {
            // The resource wasn't found, halt the execution.
            if (! resource) {
                done(new NotFoundException(`resource not found: ${Model.slug}`, null));
            }
            if (template) {
                return this.app.root.render(template, {model: resource}).then(html => {
                    return done(html);
                });
            }

            return done(resource);

        }).catch(err => {
            done(new NotFoundException("database error: "+err.message, err));
        });
    }
}

/**
 * Figures out the Model request filter
 * based on the request parameters and configuration.
 * @param Model {Model}
 * @param request {IncomingMessage}
 * @param filter {String}
 * @returns {{}}
 */
function getFilterObject(Model,request,filter)
{
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

    return {[filterName] : filterValue};
}

module.exports = Resource;