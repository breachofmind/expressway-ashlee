"use strict";

var Expressway = require('expressway');

/**
 * The unchanging static file path.
 * @type {string}
 */
const STATIC_PATH = "/static";

class AshleeCMSModule extends Expressway.Module
{
    get alias() { return "$cms" }

    constructor(app)
    {
        super(app);

        this.requires(
            'AppModule',
            'APIModule',
            'GraphicsProvider'
        );

        this.package = require('../../package.json');
        this.appName = "Admin";
        this.baseUri = "/cms";
        this.webpack = require('../../webpack.config.js');

        this.middleware = [
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
        ];

        this.routes = {
            'GET /' : 'CMSIndexController.index'
        };

        this.hmrOptions = {
            path: STATIC_PATH+"/__webpack_hmr"
        };
    }

    /**
     * Register with the application.
     * @param app Application
     * @param paths PathService
     * @param $app Module
     */
    register(app,paths,$app)
    {
        this.parent('AppModule');

        app.alias('cms', this.baseUri);
        app.alias('static', this.baseUri + STATIC_PATH + "/");

        // Create paths to CMS folders.
        paths.set('cms_root', __dirname+"/../");
        paths.set('cms_resources', paths.cms_root('../resources'));
        paths.set('cms_views', paths.cms_resources('views'));
        paths.set('cms_public', paths.cms_root('../public'));

        // Add modules from our directory structure.
        this.directories({
            middlewares:  paths.cms_root('middlewares'),
            controllers:  paths.cms_root('controllers'),
            localization: paths.cms_resources('locale')
        });

        app.call(this,'configureTemplateEngine');

        // Add a middleware to the front-end application.
        $app.middleware.push('AshleeFrontend');

        // Add a static path.
        this.staticPaths[STATIC_PATH] = paths.cms_public();
    }

    /**
     * Configures the grenade engine.
     * @param app Application
     * @param paths PathService
     */
    configureTemplateEngine(app,paths)
    {
        // Using grenade templates.
        require('grenade/expressway').addTo(this, {
            extension: 'htm',
            rootPath: paths.cms_views(),
            componentPath: paths.cms_root('components/'),
            delimiter: require('grenade/delimiters').HANDLEBARS,
            enableCache: app.env == ENV_PROD
        });
    }

    /**
     * Fire when all providers are loaded.
     * @param app Application
     * @param paths PathService
     * @param $auth Module
     * @param controller object
     * @param devMiddleware Middleware
     * @param $cms Module
     * @param url UrlService
     */
    boot(app,paths,$auth,controller, devMiddleware, $cms,url)
    {
        devMiddleware.watch(paths.cms_views())

        let viewDefaults = (view) => {
            view.use('cmsVersion', $cms.package.version);
            view.script('ashleeScripts',url(app.alias('static') + 'main.bundle.js'));
            view.style('ashleeAppStyles',url(app.alias('static') + 'base.css'));
            view.style('ashleeBaseStyles', url(app.alias('static') + 'main.css'));
        };

        controller.CMSIndexController.defaults.push(viewDefaults);
        controller.AuthController.defaults.push(viewDefaults);

        // Because we're using the Auth controller,
        // let's change some settings.
        $auth.successUri     = this.baseUri;
        $auth.loginView      = "$cms:auth/login";
        $auth.forgotView     = "$cms:auth/forgot";
        $auth.resetView      = "$cms:auth/reset";
        $auth.resetEmailView = "$cms:email/reset";

        this.add(this.middleware);
        this.add(this.routes);
        this.add('AshleeNotFound');
    }

}

module.exports = AshleeCMSModule;