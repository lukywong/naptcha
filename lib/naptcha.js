var naptchaNative = require('../build/Release/naptcha.node');
var fs = require('fs');
var R = require('ramda');

function naptcha(value) {
  const defaultValue = {
    path: './',
    fileName: Date.now(),
    type: 'jpeg',
    width: 120,
    height: 65,
    quality: 50,
    fontSize: 57,
    textGen: randomTextGen
  };
  this.__value = R.merge(defaultValue, value || {});
}

naptcha.of = function(val) {
  return new naptcha(val);
};

naptcha.prototype.map = function(xform) {
  return naptcha.of(xform(this.__value));
};

naptcha.prototype.perform = function(text) {

  const {
    path,
    fileName,
    type,
    width,
    height,
    quality,
    fontSize,
    textGen
  } = this.__value;

  const isJpeg = type.toUpperCase() == 'JPEG';
  const filePath = path + fileName + '.' + (isJpeg ? 'jpeg' : 'bmp');
  const txt = text || textGen();

  naptchaNative.generate(txt, filePath, txt.length, width, height, quality, isJpeg, fontSize);

  return Object.create(fs.createReadStream(filePath), {
    text: { value: txt }
  });
};

const mergeOptionAs = R.curry(function(name, val, options) {
  return R.merge(options, R.zipObj([name], [val]));
});

naptcha.path = mergeOptionAs('path');
naptcha.fileName = mergeOptionAs('fileName');
naptcha.type = mergeOptionAs('type');
naptcha.width = mergeOptionAs('width');
naptcha.height = mergeOptionAs('height');
naptcha.quality = mergeOptionAs('quality');
naptcha.fontSize = mergeOptionAs('fontSize');
naptcha.textGen = mergeOptionAs('textGen');

const randomTextGen = function() {
  return require('crypto').randomBytes(2).toString('hex');
}

module.exports = naptcha;
