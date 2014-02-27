/*

crash.js - crash test

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

var tart = require('../index.js');

var test = module.exports = {};

test['config behavior crash should not crash the configuration/sponsor'] = function (test) {
    test.expect(20);
    
    var crashingConfig = function crashingConfig(count) {
        return function crashingConfigBeh(message) {
            count--;
            test.ok(true);
            if (count > 0) {
                throw new Error("boom!");
            }
            test.done();
        };
    };

    var countingActor = function countingActor(count) {
        return function countingActorBeh(message) {
            this.config('crash?');
            count--;
            test.ok(true);
            if (count > 0) {
                this.self();
            }
        };
    };

    var sponsor = tart.behaving({behavior: crashingConfig(10)});

    var counting = sponsor(countingActor(10));
    counting('go');
};