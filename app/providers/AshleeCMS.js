"use strict";

var Expressway = require('expressway');

class AshleeCMS extends Expressway.Module
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

        this.baseUri = "/cms";
    }

    /**
     * Register with the application.
     * @param app Application
     * @param path PathService
     * @param controllerService ControllerService
     * @param localeService LocaleService
     */
    register(app,path,controllerService,localeService,$app)
    {
        this.parent('AppModule');

        // Create paths to CMS folders.
        path.set('cms_root', __dirname+"/../");
        path.set('cms_resources', path.cms_root('resources'));
        path.set('cms_views', path.cms_resources('views'));
        path.set('cms_public', path.cms_root('../public'));

        controllerService.addDirectory(path.cms_root('middlewares/'));
        controllerService.addDirectory(path.cms_root('controllers/'));

        // Add the locale key directory.
        localeService.addDirectory(path.cms_resources('locale/'));

        // Using grenade templates.
        require('grenade/expressway').addTo(this, {
            delimiter: require('grenade/delimiters').HANDLEBARS,
            extension: 'htm',
            rootPath: path.cms_views().get(),
            componentPath: path.cms_root('components').get(),
        });

        $app.middleware.push('AshleeFrontend');
    }

    /**
     * Fire when all providers are loaded.
     * @param app Application
     * @param path PathService
     * @param $auth Module
     */
    boot(app,path,$auth)
    {
        // Because we're using the Auth controller, let's change some settings.
        $auth.successUri = this.baseUri;

        this.static('/static', path.cms_public());

        this.add([
            'ConsoleLogging',
            'Ajax',
            'Localization',
            'BodyParser',
            'Session',
            'BasicAuth',
            'Flash',
            'AuthRequired'
        ]);

        this.add({
            'GET /' : 'CMSIndexController.index'
        });

        this.add('AshleeNotFound');
    }

}

module.exports = AshleeCMS;