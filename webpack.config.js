"use strict";
var expressway = require('expressway');
global.EXPRESSWAY_CONTEXT = CXT_CLI;
var app = require('expressway/demo');
var compiler = app.extensions.get('cms').webpack.configuration;

console.log(compiler);
module.exports = compiler;