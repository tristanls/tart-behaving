/*

index.js - "tart-behaving": Behaving configuration implementation

The MIT License (MIT)

Copyright (c) 2014 Dale Schumacher, Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/
"use strict";

var tart = require('tart');

/*
  * `options`: _Object_ _(Default: undefined)_ Optional overrides.
    * `behavior`: _Function_ _(Default: `function (message) {}`)_
        `function (message) {}` Configuration behavior to invoke every time
        a message is sent to the configuration via `this.config(message)`.
    * `constructConfig`: _Function_ _(Default: `function (options) {}`)_ 
        `function (options) {}` Configuration creation function that 
        is given `options`. It should return a capability `function (behavior) {}` 
        to create new actors.
    * `deliver`: _Function_ _(Default: `function (context, message, options) {}`)_ 
        `function (context, message, options) {}` Deliver function that returns 
        a function for `dispatch` to dispatch.
    * `dispatch`: _Function_ _(Default: `setImmediate`)_ 
        `function (deliver) {}` Dispatch function for dispatching `deliver` 
        closures. 
    * `fail`: _Function_ _(Default: `function (exception) {}`)_ 
        `function (exception) {}` An optional handler to call if a sponsored actor
        behavior throws an exception. 
*/
module.exports.behaving = function behaving(options) {
    options = options || {};

    options.behavior = options.behavior || function (message) {};

    options.constructConfig = options.constructConfig || function constructConfig(options) {
        var config = function create(behavior) {
            var actor = function send(message) {
                options.dispatch(options.deliver(context, message, options));
            }
            var context = {
                self: actor,
                behavior: behavior,
                sponsor: config,
                config: sendToConfig
            };
            return actor;
        };

        var sendToConfig = function sendToConfig(message) {
            options.dispatch(options.deliver(configContext, message, options));
        };

        var configContext = {
            self: sendToConfig,
            behavior: options.behavior,
            sponsor: config,
            config: sendToConfig
        };

        return config;
    };

    return tart.pluggable(options);
};