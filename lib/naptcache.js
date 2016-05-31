const nap = require('./naptcha');
const memoize = require('memoizee');
const crypto = require('crypto');
const fs = require('fs');

const CACHE_SIZE = 50;

const generateText = function() {
  return crypto.randomBytes(2).toString('hex');
};

function naptcache(options) {
  this.captcha = nap.of(options);
  this.cache = [];
  this.cacheSize = CACHE_SIZE;
  const fn = text => this.captcha.perform(text);
  const dispose = value => fs.unlink(value.path);
  this.memoized = memoize(fn, { dispose });
};

naptcache.of = function(options) {
  return new naptcache(options);
};

naptcache.prototype.refresh = function() {
  this.cache = [];
  this.memoized.clear();
  for (var i = 0; i < this.cacheSize; i++) {
    const text = generateText();
    this.cache.push(text);
    this.memoized(text);
  }
};

naptcache.prototype.get = function() {
  const index = Math.round(this.cacheSize * Math.random());
  return this.memoized(this.cache[index]);
};

module.exports = naptcache;
