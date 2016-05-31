'use strict';

var naptcache = require('./naptcache');

var DELAY = 60 * 1000;

function naptcha(options) {
  var _this = this;
  _this.cache = naptcache.of(options);
  _this.cache.refresh();
  setInterval(function () {
    _this.cache.refresh();
  }, DELAY);
}

naptcha.of = function (options) {
  return new naptcha(options);
};

naptcha.prototype.perform = function () {
  return this.cache.get();
};

module.exports = naptcha;