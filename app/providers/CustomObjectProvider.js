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
        CustomObject.all().then((objects) =>
        {
            objects.forEach(customObject =>
            {
                // If we already have this model, allow the user to override settings.
                if (app.models.has(customObject.name)) {
                    let model = app.models.get(customObject.name);
                    ['expose','slug','title','icon'].forEach(property => {
                        model[property] = customObject[property];
                    });

                } else {
                    // Otherwise, create a factory instance of the custom object.
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