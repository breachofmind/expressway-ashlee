"use strict";

var Provider = require('expressway').Provider;
var sharp = require('sharp');
var path = require('path');
var Promise = require('expressway').Promise;

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
        app.call(this,'mediaImportCommand');

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

    /**
     * Command to import media.
     * @param app
     * @param cli
     * @param media
     * @param paths
     */
    mediaImportCommand(app,cli,media,paths,log,utils,Media)
    {
        cli.command('import [options]', "Import all media from a directory")
            .option('-p, --path', "The path to import")
            .option('-s, --save', "Save to the database as Media objects")
            .action((env,opts) => {
                let timer = utils.timer();
                let path = paths.build.root(opts.path || 'import');
                let save = Boolean(opts.save);

                path.glob().then(images =>
                {
                    log.info('found %s images', images.length);

                    let promises = images.map(image => {
                        return new Promise(resolve => {
                            media.upload(image).then(sizes => {
                                Media.create({
                                    file_name: sizes[0].basename,
                                    file_type: "image/"+sizes[0].format,
                                    title: sizes[0].basename
                                }).then(result => {
                                    resolve();
                                })
                            });
                        })

                    });

                    Promise.all(promises).then(result => {
                        log.info('import finished in %s', timer.lap());
                        process.exit();
                    })

                });


            })
    }
}

module.exports = GraphicsProvider;