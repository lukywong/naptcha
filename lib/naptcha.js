var naptchaNative = require('../build/Release/naptcha.node');
var fs = require('fs');
var curry = require('curry');
var assign = require('object-assign');
var path = require('path');

function naptcha(value) {
  const defaultValue = {
    dir: '.',
    fileName: Date.now(),
    type: 'jpeg',
    width: 160,
    height: 50,
    quality: 50,
    fontSize: 57,
    offset: 40,
    charSpace: 20,
    textGen: randomTextGen
  };
  this.__value = assign(defaultValue, value || {});
}

naptcha.of = function(val) {
  return new naptcha(val);
};

naptcha.prototype.map = function(xform) {
  return naptcha.of(xform(this.__value));
};

naptcha.prototype.perform = function(text) {

  const {
    dir,
    fileName,
    type,
    width,
    height,
    quality,
    fontSize,
    offset,
    charSpace,
    textGen
  } = this.__value;

  const isJpeg = type.toUpperCase() == 'JPEG';
  const filePath = path.join(dir, fileName + '.' + (isJpeg ? 'jpeg' : 'bmp'));
  const txt = text || textGen();

  naptchaNative.generate(txt, filePath, txt.length, width, height, quality, isJpeg, fontSize, offset, charSpace);

  return Object.create(fs.createReadStream(filePath), {
    text: { value: txt }
  });
};

const zipObj = function(arr1, arr2) {
  return arr1.reduce(function(sofar, curr, index) {
    sofar[curr] = arr2[index];
    return sofar;
  }, {});
}

const mergeOptionAs = curry(function(name, val, options) {
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

const randomTextGen = function() {
  return require('crypto').randomBytes(2).toString('hex');
}

module.exports = naptcha;
