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
     * @param middleware object
     * @returns {View}
     */
    index(request,response,next,view,cms)
    {
        view.template('cms:index');
        view.title(cms.appName);

        return view;
    }

    /**
     * Returns the application state for the logged in user.
     * POST /_state
     * @param request
     * @param response
     * @param next
     */
    state(request,response,next,currentUser)
    {
        return {
            user : currentUser,
            // TODO
            defs : {
                user: {
                    title: 'email',
                    model: "user",
                    fields: [
                        {
                            name: "email",
                            label: "Email",
                            type: "email",
                        },
                        {
                            name: "first_name",
                            label: "First Name",
                            type: "text",
                        },
                        {
                            name: "last_name",
                            label: "Last Name",
                            type: "text",
                        },
                    ]
                },
                media: {
                    title:'file_name',
                    model: "media",
                    fields: [
                        {
                            name: "file_name",
                            label: "File Name",
                            type: 'text'
                        },
                        {
                            name: "file_type",
                            label: "Type",
                            type: "text"
                        }
                    ]
                }
            }
        }
    }
}

module.exports = CMSIndexController;