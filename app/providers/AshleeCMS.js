"use strict";

var Expressway = require('expressway');

class AshleeCMS extends Expressway.Module
{
    constructor(app)
    {
        super(app);

        this.requires = [
            'AppModule',
            'APIModule',
            'GraphicsProvider',
            'LocaleProvider'
        ];

        this.baseUri = "cms";
    }

    /**
     * Register with the application.
     * @param app Application
     * @param path PathService
     * @param config function
     * @param controllerService ControllerService
     * @param localeService LocaleService
     */
    register(app,path,config,controllerService,localeService)
    {
        this.parent('AppModule', this.baseUri);

        // Create paths to CMS folders.
        path.set('cms_root', __dirname+"/../");
        path.set('cms_resources', path.cms_root('resources'));
        path.set('cms_views', path.cms_resources('views'));
        path.set('cms_public', path.cms_root('../public'));

        controllerService.addDirectory(path.cms_root('controllers/'));

        // Add the locale key directory.
        localeService.addLocaleDir(path.cms_resources('locale/'));
    }

    /**
     * Fire when all providers are loaded.
     * @param app Application
     */
    boot(app,path)
    {
        this.static('/static', path.cms_public());

        this.add([
            'ConsoleLogging',
            'Ajax',
            'Localization',
            'BodyParser',
            'Session',
            'BasicAuth',
            'Flash'
        ]);

        this.add({
            'GET /' : 'CMSIndexController.index'
        });
    }

}

module.exports = AshleeCMS;