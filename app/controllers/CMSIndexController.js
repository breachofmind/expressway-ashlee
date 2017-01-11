var _ = require('lodash');
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
        view.use('randomQuote', randomQuote());

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
            json.objects[model.slug] = model.toJSON();
        });

        return customGroupRepository.then(customGroups =>
        {
            customGroups.forEach(group => {
                let objects = group.objects.map(customObject => {
                    return customObject.slug;
                });
                group.objects = objects;
                json.groups.push(group);
            });

            return json;
        });
    }
}

function randomQuote() {
    let quotes = [
        "I like your shirt today.",
        "Did you forget to comb your hair?",
        "Don't let them get your goat.",
        "The answer is 46.",
        "When in doubt, pick 'C'.",
        "Nice face.",
        "Cool hat!",
        "Look at the kitty!",
        "Stare at the void. Void stares back.",
        "Excuse you.",
        "Trim your beard.",
        "For your health."
    ];
    return _.sample(quotes);
}

module.exports = CMSIndexController;