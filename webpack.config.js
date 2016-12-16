"use strict";

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const RESOURCE_PATH = path.resolve(__dirname, 'resources');
const JSCRIPT_PATH  = path.resolve(RESOURCE_PATH, 'js');
const BUILD_PATH    = path.resolve(__dirname,'public');
const CMS_STATIC_PATH = '/cms/static/';

module.exports = {
    entry: {
        main: [
            'webpack/hot/dev-server',
            'webpack-hot-middleware/client?path='+CMS_STATIC_PATH+'__webpack_hmr',
            path.resolve(JSCRIPT_PATH,'main.js'),
        ],
        base: path.resolve(JSCRIPT_PATH, 'base.js')
    },
    output: {
        path: BUILD_PATH,
        publicPath: 'http://localhost:8081'+CMS_STATIC_PATH,
        filename: '[name].bundle.js'
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/,
                query: {
                    cacheDirectory:true,
                    presets: ['es2015']
                }
            },
            //{test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader',['css-loader','postcss-loader','sass-loader'])},
            { test: /\.scss$/, loaders: ['style-loader','css-loader','postcss-loader','sass-loader'] },
            { test: /\.css$/,  loaders: ['style-loader', 'css-loader'] },
            { test: /\.vue$/,  loaders: ['vue-loader'] },
        ]
    },
    sassLoader: {
        outputStyle: 'compact',
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        //new ExtractTextPlugin("[name].css")
    ],
};