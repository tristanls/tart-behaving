# tart-behaving

_Stability: 1 - [Experimental](https://github.com/tristanls/stability-index#stability-1---experimental)_

[![NPM version](https://badge.fury.io/js/tart-behaving.png)](http://npmjs.org/package/tart-behaving)

Behaving configuration implementation for [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs) that actors can send messages to.

## Contributors

[@dalnefre](https://github.com/dalnefre), [@tristanls](https://github.com/tristanls)

## Overview

Behaving configuration implementation for [Tiny Actor Run-Time in JavaScript](https://github.com/organix/tartjs) that actors can send messages to.

  * [Usage](#usage)
  * [Tests](#tests)
  * [Documentation](#documentation)
  * [Sources](#sources)

## Usage

To run the below example run:

    npm run readme

```javascript
"use strict";

var tart = require('../index.js');

var oneTimeLogBeh = function oneTimeLogBeh(message) {
    console.log('[logger]', message);
    this.behavior = function ignore(message) {};
};

var sponsor = tart.behaving({behavior: oneTimeLogBeh});

var someBeh = function someBeh(message) {
    var timestamp = new Date().getTime();
    this.config(timestamp);
    this.config(timestamp);
    message.customer('hi');
};

var customerBeh = function customerBeh(message) {
    console.log('customer:', message);
};

var actor = sponsor(someBeh);
var customer = sponsor(customerBeh);

actor({customer: customer});
```

## Tests

    npm test

## Documentation

**Public API**

  * [tart.behaving(\[options\])](#tartbehavingoptions)
  * [sponsor(behavior)](#sponsorbehavior)
  * [actor(message)](#actormessage)

### tart.behaving([options])

  * `options`: _Object_ _(Default: undefined)_ Optional overrides.
    * `behavior`: _Function_ _(Default: `function (message) {}`)_ `function (message) {}` Configuration behavior to invoke every time a message is sent to the configuration via `this.config(message)`.
    * `constructConfig`: _Function_ _(Default: `function (options) {}`)_ `function (options) {}` Configuration creation function that is given `options`. It should return a capability `function (behavior) {}` to create new actors.
    * `deliver`: _Function_ _(Default: `function (context, message, options) {}`)_ `function (context, message, options) {}` Deliver function that returns a function for `dispatch` to dispatch.
    * `dispatch`: _Function_ _(Default: `setImmediate`)_ `function (deliver) {}` Dispatch function for dispatching `deliver` closures. 
    * `fail`: _Function_ _(Default: `function (exception) {}`)_ `function (exception) {}` An optional handler to call if a sponsored actor behavior throws an exception.

Creates a sponsor capability to create new actors with and allows replacing parts of the implementation. It is implemented on top of [TartJS Pluggable](https://github.com/organix/tartjs#tartpluggableoptions) API.

### sponsor(behavior)

Similar to the core [TartJS Minimal](https://github.com/organix/tartjs#minimal) implementation (_See: [sponsor(behavior)](https://github.com/organix/tartjs#sponsorbehavior-1)_) with the following addition.

When the `behavior` is invoked upon the receipt of a message, it's `this` will be additionally bound with:

  * `this.config`: _Function_ `function (message) {}` Reference to the config that is sponsoring the executing `behavior` (in form of a capability that can be invoked to send the config a message).

### actor(message)

Same as the core [TartJS Minimal](https://github.com/organix/tartjs#minimal) implementation. _See: [actor(message)](https://github.com/organix/tart#actormessage-1)_

## Sources

  * [Tiny Actor Run-Time](https://github.com/organix/tart)