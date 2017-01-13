"use strict";

var expressway  = require('expressway');
var path        = require('path');
var Promise     = expressway.Promise;
var fs          = require('fs');
var sharp       = require('sharp');
var _           = require('lodash');

module.exports = function(app,url,paths,log,debug)
{
    /**
     * A class for common image manipulations.
     * @constructor
     */
    return new class MediaService
    {
        constructor()
        {
            this.sizes = {};
            this.degradation = ['thumb','medium','large','original'];
        }

        get name() {
            return this.constructor.name;
        }

        /**
         * Return the path to a file.
         * Resolves to a lesser file size if the given file size doesn't exist.
         * @param fileName string
         * @param size string
         * @returns {string}
         */
        path(fileName, size)
        {
            let resolvedSize = this.size(fileName,size);
            if (! resolvedSize) {
                return null;
            }
            return paths.uploads(resolvedSize+"/"+fileName);
        }

        /**
         * Like path(), only returns a URL to the image.
         * @param fileName string
         * @param size string
         * @param notFound string - optional
         * @returns {string|null}
         */
        url(fileName, size, notFound = null)
        {
            let resolvedSize = this.size(fileName,size);
            if (! resolvedSize) {
                return notFound;
            }
            return url.get("uploads/"+resolvedSize+"/"+fileName); // Todo, dynamic
        }

        /**
         * Given the size and file name,
         * check for the size or next best size.
         * @param fileName string
         * @param size string
         * @returns {string|null}
         */
        size(fileName, size)
        {
            if (! this.has(size)) return null;

            let index = this.degradation.indexOf(size);

            for(index; index < this.degradation.length; index++) {

                let file = paths.build.uploads(this.degradation[index]+"/"+fileName);

                // This file size does exist.
                if (file.exists) {
                    return this.degradation[index];
                }
            }
            return null;
        }


        /**
         * Check if a given size is registered.
         * @param size string
         * @returns {boolean}
         */
        has(size)
        {
            return this.sizes.hasOwnProperty(size);
        }

        /**
         * Generate a new size.
         * @param size string
         * @param inputFile string
         * @param outputFile string|function
         * @returns {*}
         */
        generate(size, inputFile, outputFile)
        {
            if (! this.sizes[size]) {
                throw new Error(`no size configured: ${size}`);
            }
            let image = sharp(inputFile);

            // If the size is called and returns false,
            // don't allow the manipulation to occur.
            return image.metadata().then(meta =>
            {
                meta.size = size;

                let modified = this.sizes[size].call(null, image, meta, sharp);
                if (! modified) {
                    return null;
                }
                meta.filename = typeof outputFile == 'function' ? outputFile(inputFile,meta) : outputFile;
                meta.basename = path.basename(meta.filename);

                log.info("creating file: %s -> %s",inputFile, meta.filename);

                modified.toFile(meta.filename);

                return meta;
            });
        }

        /**
         * Special method for uploading a file.
         * Saves the file in the given size directories.
         * @param inputFile string
         * @param sizes array
         * @returns {Promise}
         */
        upload(inputFile, sizes = ['original','thumb','medium','large'])
        {
            let promises = sizes.map(size =>
            {
                return this.generate(size, inputFile, function(filePath, meta) {
                    let fileName = path.basename(filePath);
                    return paths.uploads(size+"/"+fileName);
                });
            });

            return Promise.all(promises);
        }

        /**
         * Add a new size manipulator, as well as an uploads path and method.
         * @param name string
         * @param manipulator function
         */
        add(name, manipulator)
        {
            if (typeof name == 'object') {
                _.each(name,(fn,size) => { this.add(size,fn) });
                return this;
            }
            this.sizes[name] = manipulator;

            debug("MediaService added size: %s", name);

            paths.add("uploads_"+name, paths.uploads(name));

            this[name] = function(inputFile,outputFile) {
                return this.generate(name, inputFile, outputFile);
            }
        }
    }
};