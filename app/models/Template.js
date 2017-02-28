var _   = require('lodash');
var expressway = require('expressway');
var Model = expressway.Model;

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
     * @param components {ComponentService}
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

            // Just in case no controller was given.
            if (! template.controller || template.controller == "") {
                template.controller = "TemplateController.default";
            }

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

                        // Render each component and attach to the response view data.
                        components.render(request,template.slots).then(rendered => {
                            response.view.use('cmp', rendered);
                            return next();
                        }).catch(err => {
                            return next(err);
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
     * Return a template loader to add to an extension router.
     * @returns {function}
     */
    get loader()
    {
        let Template = this;

        return function() {
            return Template.all().then(templates => {
                let objects = templates.map(template => {
                    return template.route();
                });

                return _.assign({},...objects);
            });
        };
    }
}

module.exports = Template;