"use strict";

var Extension = require('expressway').Extension;
var path = require('path');
var Component = require('./Component');

/**
 * The unchanging static file path.
 * @type {string}
 */
const STATIC_PATH = "/static";

class AshleeCMSExtension extends Extension
{
    constructor(app,paths,locale,config)
    {
        super(app);

        this.alias = "cms";
        this.title = "Admin";
        this.base = "/cms";
        this.logo = config('cms_logo', "http://dev.brightstarus.com/brightstar-logo.svg");

        this.package = require('../package.json');
        this.webpack = require('../webpack.config.js');
        this.hmrOptions = {
            path: STATIC_PATH+"/__webpack_hmr"
        };

        // Add the component service.
        app.service('components', app.load(require('./services/ComponentService')));

        // Create some useful paths.
        paths.add('cms_root', path.resolve(__dirname,".."));
        paths.add('cms_resources', paths.cms_root('resources'));
        paths.add('cms_views', paths.cms_root('resources/views'));
        paths.add('cms_public', paths.cms_root('public'));

        app.use([
            require('expressway-rest'),
            require('expressway/src/middlewares/Development'),
            require('./providers/GraphicsProvider'),
            require('./providers/CustomObjectProvider'),
            require('./providers/AshleePoliciesProvider'),
            require('./models'),
            require('./middlewares/AshleeFrontend'),
            require('./middlewares/AshleeNotFound'),
            require('./controllers/CMSIndexController'),
            require('./controllers/TemplateController'),
        ]);

        locale.addDirectory(paths.cms_resources('locale'));

        this.staticPaths[STATIC_PATH] = paths.cms_public();

        this.routes.middleware([
            'Development',
            'Static',
            'Init',
            'ConsoleLogging',
            'Ajax',
            'Localization',
            'BodyParser',
            'Session',
            'BasicAuth',
            'Flash',
            'AuthRequired'
        ]);

        this.routes.add([
            {
                'GET /'        : 'CMSIndexController.index',
                'POST /_state' : 'CMSIndexController.state',
            }
        ]);

        this.routes.error(404, 'AshleeNotFound');
    }

    /**
     * Boot method.
     * @injectable
     * @param next Function
     * @param app Application
     * @param url URLService
     * @param paths PathService
     * @param components ComponentService
     */
    boot(next,app,url,paths,components)
    {
        app.root.routes.after('BasicAuth', 'AshleeFrontend');

        components.add(require('./components/HTMLBlock'));
        components.add(require('./components/Resource'));

        app.call(this,'setupExtensions');
        app.alias('cms', this.base);
        app.alias('static', this.base + STATIC_PATH + "/");

        this.use(require('grenade/expressway'), {
            extension: 'htm',
            rootPath: paths.cms_views(),
            componentPath: paths.cms_root('app/components/'),
            delimiter: require('grenade/delimiters').HANDLEBARS,
            enableCache: app.env == ENV_PROD
        });

        url.extend({
            cms(uri) { return this.get([app.alias('cms')].concat(uri)) }
        });

        // Add the installation seeder.
        app.load(require('./db/installer'));

        super.boot(next);
    }

    /**
     * Setup extensions and modify controller properties.
     * @injectable
     * @param app Application
     * @param paths PathService
     * @param api Extension
     * @param auth Extension
     * @param controller Function
     * @param devMiddleware Middleware
     */
    setupExtensions(app,paths,api,auth,controller,devMiddleware)
    {
        api.auth = true;
        auth.successUri     = this.base;
        auth.loginView      = "cms:auth/login";
        auth.forgotView     = "cms:auth/forgot";
        auth.resetView      = "cms:auth/reset";
        auth.resetEmailView = "cms:email/reset";

        let defaults = app.call(this,'viewDefaults');

        controller('AuthController').defaults.push(defaults);
        controller('CMSIndexController').defaults.push(defaults);

        devMiddleware.watch(paths.cms_views());
    }

    /**
     * Get the view defaults.
     * @injectable
     * @param app Application
     * @param url URLService
     * @param cms Extension
     * @returns {Function}
     */
    viewDefaults(app,url,cms,config)
    {
        return function(view) {
            view.use('cmsVersion', cms.package.version);
            view.meta('generator', 'Expressway Ashlee CMS v.'+cms.package.version);

            view.script('ashleeBaseJs', app.alias('static') + 'base.bundle.js');
            // Load custom scripts
            view.use(config('ashlee.scripts', []));
            // Load the main ashlee application bundle
            view.script('ashleeMainJs', app.alias('static') + 'main.bundle.js');

            //view.style('ashleeAppStyles', app.alias('static') + 'base.css');
            //view.style('ashleeBaseStyles', app.alias('static') + 'main.css');
        }
    }
}

module.exports = AshleeCMSExtension;