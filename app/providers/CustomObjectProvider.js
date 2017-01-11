"use strict";

var expressway = require('expressway');
var Provider = expressway.Provider;

class CustomObjectProvider extends Provider
{
    /**
     * Constructor.
     * @param app Application
     */
    constructor(app)
    {
        super(app);

        // This should be booted after ModelProvider.
        this.order = 15;

        app.service(customGroupRepository.callable());
        app.service(customObjectRepository.callable());
    }

    /**
     * Get the custom objects and load them as models.
     * @param next Function
     * @param app Application
     * @param CustomObject Model
     * @param utils Object
     * @param db Driver
     */
    boot(next,app,CustomObject,utils,db)
    {
        CustomObject.all().then((customObjects) =>
        {
            customObjects.forEach(customObject =>
            {
                if (app.models.has(customObject.name)) {
                    // This is a core model.
                    customObject.configureModel(app.models.get(customObject.name));

                } else {
                    // This is a custom created model.
                    let CustomObjectModel = app.load(require('../services/CustomObjectFactory'), [customObject]);

                    app.use(CustomObjectModel);
                }

                app.models.has(customObject.name, model => {
                    model.boot(utils.noop,db);
                });
            });
            next();
        });
    }
}

function customGroupRepository(request,response,next,CustomGroup)
{
    return CustomGroup.find({active:true}).exec();
}

function customObjectRepository(request,response,next,CustomObject)
{
    return CustomObject.find({active:true}).exec();
}

module.exports = CustomObjectProvider;