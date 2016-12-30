"use strict";

var Extension = require('expressway').Extension;
var path = require('path');

/**
 * The unchanging static file path.
 * @type {string}
 */
const STATIC_PATH = "/static";

class AshleeCMSExtension extends Extension
{
    constructor(app,paths)
    {
        super(app);

        this.alias = "cms";
        this.title = "Admin";
        this.base = "/cms";

        this.package = require('../package.json');
        this.webpack = require('../webpack.config.js');
        this.hmrOptions = {
            path: STATIC_PATH+"/__webpack_hmr"
        }

        // Create some useful paths.
        paths.add('cms_root', path.resolve(__dirname,".."));
        paths.add('cms_resources', paths.cms_root('resources'));
        paths.add('cms_views', paths.cms_root('resources/views'));
        paths.add('cms_public', paths.cms_root('public'));

        app.use([
            require('expressway-rest'),
            require('expressway/src/middlewares/Development'),
            require('./providers/GraphicsProvider'),
            require('./middlewares/AshleeFrontend'),
            require('./middlewares/AshleeNotFound'),
            require('./controllers/CMSIndexController'),
        ]);

        this.staticPaths[STATIC_PATH] = paths.cms_public();

        // Routes.
        this.middleware = [
            'Init',
            'Development',
            'Static',
            'ConsoleLogging',
            'Ajax',
            'Localization',
            'BodyParser',
            'Session',
            'BasicAuth',
            'Flash',
            'AuthRequired'
        ];

        this.routes = [
            {
                'GET /'        : 'CMSIndexController.index',
                'POST /_state' : 'CMSIndexController.state'
            },
            'AshleeNotFound'
        ];
    }

    /**
     * Boot method.
     * @injectable
     * @param app Application
     * @param url URLService
     * @param paths PathService
     */
    boot(app,url,paths)
    {
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

        super.boot(app);
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
        app.root.middleware.push('AshleeFrontend');

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
    viewDefaults(app,url,cms)
    {
        return function(view) {
            view.use('cmsVersion', cms.package.version);
            view.meta('generator', 'Expressway Ashlee CMS v.'+cms.package.version);
            view.script('ashleeScripts', app.alias('static') + 'main.bundle.js');
            view.style('ashleeAppStyles', app.alias('static') + 'base.css');
            view.style('ashleeBaseStyles', app.alias('static') + 'main.css');
        }
    }
}

module.exports = AshleeCMSExtension;