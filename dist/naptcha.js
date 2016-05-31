'use strict';

var naptchaNative = require('../build/Release/naptcha.node');
var fs = require('fs');
var curry = require('curry');
var crypto = require('crypto');
var assign = require('object-assign');
var path = require('path');
var mkdir = require('mkdirp');
var rimraf = require('rimraf');

var CAPS_DIR = path.join(__dirname, '../', 'caps');
rimraf.sync(CAPS_DIR);
mkdir.sync(CAPS_DIR);

function naptcha(options) {
  var defaultOptions = {
    dir: CAPS_DIR,
    fileName: Date.now(),
    type: 'bmp',
    width: 160,
    height: 50,
    quality: 50,
    fontSize: 57,
    offset: 40,
    charSpace: 20,
    textGen: randomTextGen
  };
  this.__options = assign(defaultOptions, options || {});
}

naptcha.of = function (options) {
  return new naptcha(options);
};

naptcha.prototype.map = function (xform) {
  return naptcha.of(xform(this.__options));
};

naptcha.prototype.perform = function (txt) {
  var _options = this.__options;
  var dir = _options.dir;
  var fileName = _options.fileName;
  var type = _options.type;
  var width = _options.width;
  var height = _options.height;
  var quality = _options.quality;
  var fontSize = _options.fontSize;
  var offset = _options.offset;
  var charSpace = _options.charSpace;
  var textGen = _options.textGen;

  var isJpeg = type.toUpperCase() == 'JPEG';
  var text = txt || textGen();
  var nonce = crypto.randomBytes(8).toString('hex');
  var name = fileName + '_' + text + '_' + nonce;
  var filePath = path.join(dir, name + '.' + (isJpeg ? 'jpeg' : 'bmp'));

  naptchaNative.generate(text, filePath, text.length, width, height, quality, isJpeg, fontSize, offset, charSpace);

  try {
    var bytes = fs.readFileSync(filePath);
    return { bytes: bytes, text: text, path: filePath };
  } catch (e) {
    console.error(e);
  }
};

var zipObj = function zipObj(arr1, arr2) {
  return arr1.reduce(function (sofar, curr, index) {
    sofar[curr] = arr2[index];
    return sofar;
  }, {});
};

var mergeOptionAs = curry(function (name, val, options) {
  return assign(options, zipObj([name], [val]));
});

naptcha.dir = mergeOptionAs('dir');
naptcha.fileName = mergeOptionAs('fileName');
naptcha.type = mergeOptionAs('type');
naptcha.width = mergeOptionAs('width');
naptcha.height = mergeOptionAs('height');
naptcha.quality = mergeOptionAs('quality');
naptcha.fontSize = mergeOptionAs('fontSize');
naptcha.offset = mergeOptionAs('offset');
naptcha.charSpace = mergeOptionAs('charSpace');
naptcha.textGen = mergeOptionAs('textGen');

var randomTextGen = function randomTextGen() {
  return crypto.randomBytes(2).toString('hex');
};

module.exports = naptcha;