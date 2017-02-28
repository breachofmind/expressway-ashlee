var path = require('path');

module.exports = {
    middleware:[
        'Static',
        'Init',
        'ConsoleLogging',
        'Localization',
        'BodyParser',
        'Session',
        'BasicAuth',
        'Flash',
        'AuthRequired'
    ],
    paths: [
        {
            'GET /'                     : 'CMSIndexController.index',
            'POST /_state'              : 'CMSIndexController.state',
            'POST /template/:id/modify' : 'TemplateController.modify',
        }
    ],

    error: "AshleeNotFound",

    static: {
        "/static/" : path.resolve(__dirname, "../public")
    }
};