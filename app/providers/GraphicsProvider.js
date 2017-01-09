"use strict";

var Provider = require('expressway').Provider;
var sharp = require('sharp');
var path = require('path');

/**
 * Provides helper functions for Sharp.
 * @author Mike Adamczyk <mike@bom.us>
 */
class GraphicsProvider extends Provider
{
    /**
     * Constructor.
     * @param app Application
     */
    constructor(app)
    {
        super(app);

        this.order = 0;

        app.service('media', app.load(require('../services/MediaService')));
    }

    /**
     * Register with the application.
     * @injectable
     * @param done Function
     * @param app Application
     * @param media MediaService
     */
    boot(done,app,media)
    {
        media.add({

            "original" : function(image,meta) {
                // We can't be storing giant images on the server.
                // If you want to change this, go right ahead ;)
                if (meta.width > 2000) image.resize(2000);
                return image;
            },
            "thumb" : function(image,meta) {
                return image.resize(200,150).crop(sharp.strategy.entropy);
            },

            "medium" : function(image,meta) {
                return meta.width < 400 ? false : image.resize(400);
            },

            "large" : function(image,meta) {
                return meta.width < 800 ? false : image.resize(800);
            }
        });

        done();
    }
}

module.exports = GraphicsProvider;