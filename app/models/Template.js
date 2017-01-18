var _   = require('lodash');
var expressway = require('expressway');
var Model = expressway.Model;
var Promise = expressway.Promise;

const LABELS = {
    name:  "Name",
    url:   "URL",
    file:  "Template File",
    slots: "Component Slots",
    description:   "Description",
    priority: "Priority",
    controller: "Controller"
};

class Template extends Model
{
    constructor(app)
    {
        super(app);

        this.title   = 'name';
        this.expose  = true;
        this.icon    = 'image.view_compact';
        this.preview = null;
        this.key     = "priority";
        this.sort    = 1;
    }

    /**
     * Create the role schema.
     * @param fields {FieldCollection}
     * @param types {Object}
     */
    schema(fields,types)
    {
        fields
            .timestamps()
            .add('name', types.Title)
            .add('url', types.Text, 'fillable','display','unique','required')
            .add('file', types.Text, 'required','fillable','display')
            .add('description', types.Text,'fillable','display')
            .add('priority', types.Number, 'fillable','display', {default:0})
            .add('controller', types.Text, 'fillable', 'required', {default:"TemplateController.default"})
            .add('slots', types.ComponentSlots)
            .labels(LABELS);
    }

    /**
     * Create the role model methods.
     * @param methods {Object}
     * @returns {Object}
     */
    methods(methods,components)
    {
        /**
         * Return the route declaration object.
         * @returns {{}}
         */
        methods.route = function()
        {
            let template = this;

            // Closure for a middleware function.
            function templateLoader (id)
            {
                // Looks up the template ID to refresh the content.
                return function templateLoader (request,response,next,Template)
                {
                    Template.findById(id).then(template => {
                        response.view.template(template.file);
                        response.view.use('template', template);
                        response.view.meta('templateId', template.id);

                        components.render(request,response,next,template.slots).then(rendered => {
                            response.view.use('cmp', rendered);
                            next();
                        });
                    })
                }

            }

            return {
                ["GET "+template.url] : [templateLoader(this.id), template.controller]
            }
        };

        return super.methods(methods);
    }

    /**
     * Create routes from all Template objects.
     * @param extension
     * @param components
     * @returns {expressway.Promise}
     */
    routes(extension)
    {
        return new Promise(resolve =>
        {
            this.all().then(templates =>
            {
                templates.forEach(template =>
                {
                    extension.routes.push( template.route() );
                });

                resolve(templates);
            });
        })

    }
}

module.exports = Template;