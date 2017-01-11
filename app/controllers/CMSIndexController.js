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
    state(request,response,next,app,currentUser,customGroupRepository)
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
                fields: model.fields.toArray(),
            };
        });

        return customGroupRepository.then(customGroups => {
            customGroups.forEach(group => {
                json.groups.push(group);
            });

            return json;
        });
    }
}

module.exports = CMSIndexController;