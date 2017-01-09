var Controller = require('expressway').Controller;

class CMSIndexController extends Controller
{
    get description() {
        return "Handles all Ashlee CMS requests"
    }

    constructor(app)
    {
        super(app);

        this.middleware('index', 'CSRF');
        this.middleware('state', 'CSRF');
    }

    /**
     * Return the CMS view.
     * @param request
     * @param response
     * @param next
     * @param view function
     * @param cms Extension
     * @returns {View}
     */
    index(request,response,next,view,cms)
    {
        view.template('cms:index');
        view.title(cms.title);
        view.use('logo', cms.logo);

        return view;
    }

    /**
     * Returns the application state for the logged in user.
     * POST /_state
     * @param request
     * @param response
     * @param next
     */
    state(request,response,next,app,currentUser,customGroupRepository,customObjectRepository)
    {
        let json = {
            user: currentUser,
            objects:{},
            groups: [],
        };

        app.models.each(model =>
        {
            json.objects[model.slug] = {
                name: model.name,
                slug: model.slug,
                title: model.title,
                icon: model.icon,
                fields: [],
            };
        });

        return customObjectRepository.then(customObjects =>
        {
            customObjects.forEach(customObject => {
                if (!json.objects[customObject.slug]) return;

                json.objects[customObject.slug].fields = customObject.fields.map(field => {
                    return {
                        name: field.name,
                        type: field.type,
                        label: field.label
                    }
                })
            });
            return customGroupRepository.then(groups => {
                json.groups = groups;

                return json;
            });
        });
    }
}

module.exports = CMSIndexController;