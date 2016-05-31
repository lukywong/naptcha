'use strict';

var nap = require('./naptcha');
var memoize = require('memoizee');
var crypto = require('crypto');
var fs = require('fs');

var CACHE_SIZE = 50;

var generateText = function generateText() {
  return crypto.randomBytes(2).toString('hex');
};

function naptcache(options) {
  var _this = this;

  this.captcha = nap.of(options);
  this.cache = [];
  this.cacheSize = CACHE_SIZE;
  var fn = function fn(text) {
    return _this.captcha.perform(text);
  };
  var dispose = function dispose(value) {
    return fs.unlink(value.path);
  };
  this.memoized = memoize(fn, { dispose: dispose });
};

naptcache.of = function (options) {
  return new naptcache(options);
};

naptcache.prototype.refresh = function () {
  this.cache = [];
  this.memoized.clear();
  for (var i = 0; i < this.cacheSize; i++) {
    var text = generateText();
    this.cache.push(text);
    this.memoized(text);
  }
};

naptcache.prototype.get = function () {
  var index = Math.round(this.cacheSize * Math.random());
  return this.memoized(this.cache[index]);
};

module.exports = naptcache;