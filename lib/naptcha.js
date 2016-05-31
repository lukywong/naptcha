const naptchaNative = require('../build/Release/naptcha.node');
const fs = require('fs');
const curry = require('curry');
const crypto = require('crypto');
const assign = require('object-assign');
const path = require('path');
const mkdir = require('mkdirp');
const rimraf = require('rimraf');

const CAPS_DIR = path.join(__dirname, '../', 'caps');
rimraf.sync(CAPS_DIR);
mkdir.sync(CAPS_DIR);

function naptcha(options) {
  const defaultOptions = {
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

naptcha.of = function(options) {
  return new naptcha(options);
};

naptcha.prototype.map = function(xform) {
  return naptcha.of(xform(this.__options));
};

naptcha.prototype.perform = function(txt) {

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
  } = this.__options;

  const isJpeg = type.toUpperCase() == 'JPEG';
  const text = txt || textGen();
  const nonce = crypto.randomBytes(8).toString('hex');
  const name = `${fileName}_${text}_${nonce}`;
  const filePath = path.join(dir, name + '.' + (isJpeg ? 'jpeg' : 'bmp'));

  naptchaNative.generate(
    text,
    filePath,
    text.length,
    width,
    height,
    quality,
    isJpeg,
    fontSize,
    offset,
    charSpace
  );

  try {
    const bytes = fs.readFileSync(filePath);
    return { bytes, text, path: filePath };
  } catch(e) {
    console.error(e);
  }

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
  return crypto.randomBytes(2).toString('hex');
}

module.exports = naptcha;
