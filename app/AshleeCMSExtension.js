"use strict";

var Extension = require('expressway').Extension;
var path = require('path');
var Component = require('./Component');

class AshleeCMSExtension extends Extension
{
    constructor(app,paths,config)
    {
        super(app);

        this.alias   = "cms";
        this.title   = config('cms.title',"Admin");
        this.base    = config('cms.base', "/cms");
        this.logo    = config('cms.logo', "http://dev.brightstarus.com/brightstar-logo.svg");
        this.package = require('../package.json');

        app.use(require('../config/modules'));

        this.use(require('grenade/expressway'), {
            extension: 'htm',
            rootPath: paths.cms_views(),
            componentPath: paths.cms_root('app/components/'),
            delimiter: require('grenade/delimiters').HANDLEBARS,
            enableCache: app.env == ENV_PROD
        });

        this.routes.use(require('../config/routes'));
    }


    /**
     * Boot method.
     * @injectable
     * @param next Function
     * @param app Application
     * @param url URLService
     * @param components ComponentService
     * @param paths PathService
     */
    boot(next,app,url,components,paths)
    {
        this.webpack.context = paths.cms_root();
        this.webpack.publicPath = this.base + this.routes.statics[0].uri;
        this.webpack.resourcePath = paths.cms_resources();
        this.webpack.read(this.package);
        this.webpack.entry('base.js');
        this.webpack.entry('main.js');

        components.add([
            require('./components/HTMLBlock'),
            require('./components/Resource')
        ]);

        app.call(this,'bootExtensions');

        url.extend('cms', this.base);

        // Add the installation seeder.
        app.load(require('./db/installer'));

        // If this is installed as a module, we're not developing it.
        if (/node_modules/.test(__dirname)) {
            return super.boot(next);
        } else {
            this.webpack.server().then(result => {
                super.boot(next);
            });
        }
    }

    /**
     * Setup extensions and modify controller properties.
     * @injectable
     * @param app Application
     * @param paths PathService
     * @param api Extension
     * @param auth Extension
     * @param controller Function
     * @param livereload LivereloadService
     */
    bootExtensions(app,paths,api,auth,controller,livereload)
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
            this.webpack.attach(view);
        };

        controller('AuthController').defaults.push(viewDefaults);
        controller('CMSIndexController').defaults.push(viewDefaults);

        livereload.watch(paths.cms_views());
    }
}

module.exports = AshleeCMSExtension;