(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// var _ = require("lodash"),
// const Bounce = require("bounce.js")
var Cookies = require("js-cookie"),
  Typewriter = require("typewriter")

const phrases = {
  0: [
    "Welcome to a really great food blog!",
    "You're going to love this food blog!",
    "Hello new Internet friend"
  ],
  1: [
    "Welcome back!",
    "Glad to see that you like this blog!",
    "You should consider sharing this blog"
  ],
  10: [
    "Glad to see you again! You seem to like the blog a lot! :D",
    "Hello again",
    "You look really nice today. It's also nice seeing you :)",
    "How many more times are you going to visit? :D I should making games for us to play"
  ],
  100: [
    "Glad to see you again! You seem to like the blog a lot! :D",
    "Hello again",
    "You look really nice today. It's also nice seeing you :)",
    "How many more times are you going to visit? :D I should start making games for us to play",
    "I want you to meet "
  ]
}

function writeTypewriterGreeter() {
  var el = document.getElementById("greet"),
    count = Cookies.get("times visited") || 0,
    typewriter = Typewriter(el)
      .withAccuracy(99)
      .withMinimumSpeed(15)
      .withMaximumSpeed(30)
      .build()

  if (!count) Cookies.set("times visited", 1, {expires: 7, path: ""})
  else {
    Cookies.set("times visited", parseInt(count) + 1, {expires: 7, path: ""})
  }

  typewriter.type(randomPhrase(count))
}

function randomPhrase(visits) {
  visits = parseInt(visits)

  let phrase = undefined
  switch (true) {
    case visits > 100:
      phrase = phrases[100]
      break

    case visits > 10:
      phrase = phrases[10]
      break

    case 10 >= visits && visits > 1:
      phrase = phrases[1]
      break

    default:
      phrase = phrases[0]
      break
  }
  return phrase[Math.floor(Math.random() * phrase.length)]
}

window.onload = () => writeTypewriterGreeter()

},{"js-cookie":4,"typewriter":11}],2:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":14}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],4:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var characterGenerator, random;

  random = require('./random');

  characterGenerator = function(keyboardLayout, accuracy, checkInterval, text) {
    var currentIndex, shouldCorrect, typoIndex;
    currentIndex = -1;
    typoIndex = -1;
    shouldCorrect = false;
    return {
      next: function() {
        var result;
        if (currentIndex >= text.length - 1) {
          if (typoIndex !== -1) {
            shouldCorrect = true;
          } else {
            return null;
          }
        }
        if (!shouldCorrect) {
          currentIndex++;
          shouldCorrect = typoIndex !== -1 && currentIndex % checkInterval === 0;
          if (random.integerInRange(0, 100) > accuracy) {
            result = keyboardLayout.getAdjacentCharacter(text.charAt(currentIndex));
            if (result == null) {
              return text.charAt(currentIndex);
            }
            if (typoIndex === -1) {
              typoIndex = currentIndex;
              shouldCorrect = random.integerInRange(0, 1) === 1;
            }
            return result;
          } else {
            return text.charAt(currentIndex);
          }
        }
        if (currentIndex >= typoIndex) {
          currentIndex--;
          return '\b';
        }
        shouldCorrect = false;
        typoIndex = -1;
        return text.charAt(++currentIndex);
      }
    };
  };

  module.exports = characterGenerator;

}).call(this);

},{"./random":8}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var getAdjacentCharacter, isLowerCase, layout, random;

  random = require('./random');

  layout = [['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='], ['', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'], ['', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\''], ['', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/']];

  isLowerCase = function(character) {
    return character === character.toLowerCase();
  };

  getAdjacentCharacter = function(character) {
    var adjacentCharacter, adjacentCol, adjacentRow, col, i, j, randomNumber, ref, ref1, row;
    for (row = i = 0, ref = layout.length; i < ref; row = i += 1) {
      for (col = j = 0, ref1 = layout[row].length; j < ref1; col = j += 1) {
        if (layout[row][col].toLowerCase() !== character.toLowerCase()) {
          continue;
        }
        randomNumber = random.integerInRange(-1, 1);
        adjacentRow = row + randomNumber;
        if (adjacentRow >= layout.length || adjacentRow < 0) {
          adjacentRow += -2 * randomNumber;
        }
        if (col >= layout[adjacentRow].length) {
          col = layout[adjacentRow].length - 1;
        }
        if (randomNumber === 0) {
          randomNumber = [-1, 1][random.integerInRange(0, 1)];
        } else {
          randomNumber = random.integerInRange(-1, 1);
        }
        adjacentCol = col + randomNumber;
        if (adjacentCol >= layout[adjacentRow].length || adjacentCol < 0) {
          adjacentCol += -2 * randomNumber;
        }
        adjacentCharacter = layout[adjacentRow][adjacentCol];
        if (adjacentCharacter === '') {
          return getAdjacentCharacter(character);
        }
        if (isLowerCase(character)) {
          return adjacentCharacter.toLowerCase();
        }
        return adjacentCharacter;
      }
    }
    return null;
  };

  module.exports.getAdjacentCharacter = getAdjacentCharacter;

}).call(this);

},{"./random":8}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var PrioritySequence, Sequence, assert;

  assert = require('assert');

  Sequence = require('./sequence');

  PrioritySequence = (function() {
    function PrioritySequence(onWait) {
      this.onWait = onWait;
      this._sequences = [];
      this._waiting = true;
      if (typeof this.onWait === "function") {
        this.onWait();
      }
    }

    PrioritySequence.prototype._next = function() {
      var i, len, ref, s, sequence;
      sequence = null;
      ref = this._sequences;
      for (i = 0, len = ref.length; i < len; i++) {
        s = ref[i];
        if (s != null) {
          if (s.empty()) {
            continue;
          }
          sequence = s;
          break;
        }
      }
      if (sequence != null) {
        return sequence.next(this._next.bind(this));
      } else {
        this._sequences = [];
        this._waiting = true;
        return typeof this.onWait === "function" ? this.onWait() : void 0;
      }
    };

    PrioritySequence.prototype.then = function(priority, fn) {
      assert.ok(priority != null, 'The priority must be specified');
      assert.strictEqual(typeof priority, 'number', 'Priority must be a number');
      assert.strictEqual(~~priority, priority, 'Priority must be an integer');
      assert.ok(priority >= 0, 'Priority must be a positive integer');
      assert.ok(fn != null, 'The function must be specified');
      if (this._sequences[priority] == null) {
        this._sequences[priority] = new Sequence();
      }
      this._sequences[priority].add(fn);
      if (this._waiting) {
        this._waiting = false;
        return this._next();
      }
    };

    return PrioritySequence;

  })();

  module.exports = PrioritySequence;

}).call(this);

},{"./sequence":9,"assert":2}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var assert, integerInRange;

  assert = require('assert');

  integerInRange = function(min, max) {
    assert.ok(min != null, 'The minimum must be specified');
    assert.strictEqual(typeof min, 'number', 'Min must be a Number');
    assert.strictEqual(~~min, min, 'Min must be an integer');
    assert.ok(max != null, 'The maximum must be specified');
    assert.strictEqual(typeof max, 'number', 'Max must be a Number');
    assert.strictEqual(~~max, max, 'Max must be an integer');
    assert.strictEqual(min <= max, true, 'Min must be less than or equal to Max');
    if (min === max) {
      return min;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  module.exports.integerInRange = integerInRange;

}).call(this);

},{"assert":2}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Sequence, assert;

  assert = require('assert');

  Sequence = (function() {
    function Sequence() {
      this._queue = [];
    }

    Sequence.prototype.next = function(cb) {
      var fn;
      if (!this.empty()) {
        fn = this._queue.shift();
        return fn(cb);
      }
    };

    Sequence.prototype.add = function(fn) {
      assert.ok(fn != null, 'The function must be specified');
      return this._queue.push(fn);
    };

    Sequence.prototype.empty = function() {
      return this._queue.length === 0;
    };

    return Sequence;

  })();

  module.exports = Sequence;

}).call(this);

},{"assert":2}],10:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.12.6
(function() {
  var PrioritySequence, Typewriter, assert, charactergenerator, random;

  assert = require('assert');

  PrioritySequence = require('./prioritysequence');

  random = require('./random');

  charactergenerator = require('./charactergenerator');

  Typewriter = (function() {
    function Typewriter() {
      this._prioritySequence = new PrioritySequence((function(_this) {
        return function() {
          return _this._sequenceLevel = 0;
        };
      })(this));
    }

    Typewriter.prototype.setTargetDomElement = function(targetDomElement) {
      assert.ok(targetDomElement instanceof Element, 'TargetDomElement must be an instance of Element');
      return this.targetDomElement = targetDomElement;
    };

    Typewriter.prototype.setAccuracy = function(accuracy) {
      assert.strictEqual(typeof accuracy, 'number', 'Accuracy must be a number');
      assert.ok(accuracy > 0 && accuracy <= 100, 'Accuracy must be greater than 0 and less than or equal to 100');
      return this.accuracy = accuracy;
    };

    Typewriter.prototype.setMinimumSpeed = function(minimumSpeed) {
      assert.strictEqual(typeof minimumSpeed, 'number', 'MinimumSpeed must be a number');
      assert.ok(minimumSpeed > 0, 'MinimumSpeed must be greater than 0');
      if ((this.maximumSpeed != null) && minimumSpeed > this.maximumSpeed) {
        return this.minimumSpeed = this.maximumSpeed;
      } else {
        return this.minimumSpeed = minimumSpeed;
      }
    };

    Typewriter.prototype.setMaximumSpeed = function(maximumSpeed) {
      assert.strictEqual(typeof maximumSpeed, 'number', 'MaximumSpeed must be a number');
      assert.ok(maximumSpeed > 0, 'MaximumSpeed must be greater than 0');
      if ((this.minimumSpeed != null) && this.minimumSpeed > maximumSpeed) {
        return this.maximumSpeed = minimumSpeed;
      } else {
        return this.maximumSpeed = maximumSpeed;
      }
    };

    Typewriter.prototype.setKeyboardLayout = function(keyboardLayout) {
      assert.strictEqual(typeof keyboardLayout.getAdjacentCharacter, 'function', 'KeyboardLayout must have an exported getAdjacentCharacter method');
      return this.keyboardLayout = keyboardLayout;
    };

    Typewriter.prototype._makeChainable = function(cb, fn) {
      var shadow;
      shadow = Object.create(this);
      shadow._sequenceLevel = this._sequenceLevel;
      this._prioritySequence.then(this._sequenceLevel, function(next) {
        return process.nextTick(function() {
          return fn(function() {
            if (cb != null) {
              cb.call(shadow);
            }
            return next();
          });
        });
      });
      if (cb != null) {
        this._sequenceLevel++;
      }
      if ((cb == null) || this.hasOwnProperty('_prioritySequence')) {
        return this;
      }
    };

    Typewriter.prototype.clear = function(cb) {
      return this._makeChainable(cb, (function(_this) {
        return function(done) {
          var child;
          while ((child = _this.targetDomElement.lastChild) != null) {
            _this.targetDomElement.removeChild(child);
          }
          return done();
        };
      })(this));
    };

    Typewriter.prototype.waitRange = function(millisMin, millisMax, cb) {
      return this._makeChainable(cb, (function(_this) {
        return function(done) {
          return setTimeout(done, random.integerInRange(millisMin, millisMax));
        };
      })(this));
    };

    Typewriter.prototype.wait = function(millis, cb) {
      return this.waitRange(millis, millis, cb);
    };

    Typewriter.prototype.put = function(text, cb) {
      return this._makeChainable(cb, (function(_this) {
        return function(done) {
          var child, element;
          element = document.createElement('div');
          element.innerHTML = text;
          while ((child = element.firstChild) != null) {
            _this.targetDomElement.appendChild(child);
          }
          return done();
        };
      })(this));
    };

    Typewriter.prototype["delete"] = function(cb) {
      return this._makeChainable(cb, (function(_this) {
        return function(done) {
          _this.targetDomElement.removeChild(_this.targetDomElement.lastChild);
          return done();
        };
      })(this));
    };

    Typewriter.prototype.type = function(text, cb) {
      var char, checkInterval, gen;
      checkInterval = (this.minimumSpeed + this.maximumSpeed) / 2;
      gen = charactergenerator(this.keyboardLayout, this.accuracy, checkInterval, text);
      while ((char = gen.next()) !== null) {
        if (char !== '\b') {
          this.put(char);
        } else {
          this["delete"]();
        }
        this.waitRange(~~(1000 / this.maximumSpeed), ~~(1000 / this.minimumSpeed));
      }
      return this.wait(0, cb);
    };

    return Typewriter;

  })();

  module.exports = Typewriter;

}).call(this);

}).call(this,require("+xKvab"))
},{"+xKvab":3,"./charactergenerator":5,"./prioritysequence":7,"./random":8,"assert":2}],11:[function(require,module,exports){
// Generated by CoffeeScript 1.12.6
(function() {
  var Typewriter, TypewriterBuilder, assert;

  assert = require('assert');

  Typewriter = require('./typewriter');

  TypewriterBuilder = function(targetDomElement) {
    var typewriter;
    typewriter = new Typewriter();
    typewriter.setTargetDomElement(targetDomElement);
    return {
      withAccuracy: function(accuracy) {
        this.accuracy = accuracy;
        typewriter.setAccuracy(this.accuracy);
        return this;
      },
      withMinimumSpeed: function(minimumSpeed) {
        this.minimumSpeed = minimumSpeed;
        typewriter.setMinimumSpeed(this.minimumSpeed);
        return this;
      },
      withMaximumSpeed: function(maximumSpeed) {
        this.maximumSpeed = maximumSpeed;
        typewriter.setMaximumSpeed(this.maximumSpeed);
        return this;
      },
      withKeyboardLayout: function(keyboardLayout) {
        this.keyboardLayout = keyboardLayout;
        typewriter.setKeyboardLayout(this.keyboardLayout);
        return this;
      },
      build: function() {
        assert.ok(this.accuracy != null, 'Accuracy must be set');
        assert.ok(this.minimumSpeed != null, 'MinimumSpeed must be set');
        assert.ok(this.maximumSpeed != null, 'MaximumSpeed must be set');
        if (this.keyboardLayout == null) {
          typewriter.setKeyboardLayout(require('./defaultkeyboardlayout'));
        }
        return typewriter;
      }
    };
  };

  module.exports = TypewriterBuilder;

}).call(this);

},{"./defaultkeyboardlayout":6,"./typewriter":10,"assert":2}],12:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],13:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],14:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("+xKvab"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"+xKvab":3,"./support/isBuffer":13,"inherits":12}]},{},[1])