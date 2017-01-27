"use strict";

var Extension = require('expressway').Extension;
var path = require('path');
var Component = require('./Component');

/**
 * The unchanging static file path.
 * @type {string}
 */
const STATIC_PATH = "/static/";

class AshleeCMSExtension extends Extension
{
    constructor(app,paths,locale,config)
    {
        super(app);

        this.alias   = "cms";
        this.title   = config('cms.title',"Admin");
        this.base    = config('cms.base', "/cms");
        this.logo    = config('cms.logo', "http://dev.brightstarus.com/brightstar-logo.svg");
        this.package = require('../package.json');

        app.use([
            require('expressway-rest'),
            require('expressway/src/middlewares/Development'),
            require('./providers/AshleeCoreProvider'),
            require('./providers/GraphicsProvider'),
            require('./providers/CustomObjectProvider'),
            require('./providers/AshleePoliciesProvider'),
            require('./models'),
            require('./middlewares/AshleeFrontend'),
            require('./middlewares/AshleeNotFound'),
            require('./controllers/CMSIndexController'),
            require('./controllers/TemplateController'),
        ]);

        this.use(require('grenade/expressway'), {
            extension: 'htm',
            rootPath: paths.cms_views(),
            componentPath: paths.cms_root('app/components/'),
            delimiter: require('grenade/delimiters').HANDLEBARS,
            enableCache: app.env == ENV_PROD
        });

        app.call(this,'configureRoutes');
    }

    /**
     * Configure the CMS routes.
     * @param paths
     */
    configureRoutes(paths)
    {
        this.routes.static(STATIC_PATH, paths.cms_public());

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

        this.use('expressway/src/services/WebpackService');
        this.webpack.resourcePath = paths.cms_resources();
        this.webpack.readPackage(this.package);
        this.webpack.entry('base.js');
        this.webpack.entry('main.js');
        this.webpack.publicPath = this.base + STATIC_PATH;
        this.webpack.hmr = this.base + "/";
    }

    /**
     * Boot method.
     * @injectable
     * @param next Function
     * @param app Application
     * @param url URLService
     * @param components ComponentService
     */
    boot(next,app,url,components)
    {
        app.root.routes.after('BasicAuth', 'AshleeFrontend');

        components.add(require('./components/HTMLBlock'));
        components.add(require('./components/Resource'));

        app.call(this,'setupExtensions');

        url.extend('cms', this.base);

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
        api.auth            = true;
        auth.successUri     = this.base;
        auth.loginView      = "cms:auth/login";
        auth.forgotView     = "cms:auth/forgot";
        auth.resetView      = "cms:auth/reset";
        auth.resetEmailView = "cms:email/reset";

        let viewDefaults = (view) => {
            view.use('cmsVersion', this.package.version);
            view.meta('generator', 'Expressway Ashlee CMS v.'+this.package.version);
            this.webpack.loadBundles(view);
        };

        controller('AuthController').defaults.push(viewDefaults);
        controller('CMSIndexController').defaults.push(viewDefaults);

        devMiddleware.watch(paths.cms_views());
    }
}

module.exports = AshleeCMSExtension;