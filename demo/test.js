var naptcha = require('../index');
var options = {
  dir: './demo',
  fileName: Date.now(),
  type: 'jpeg',
  width: 160,
  height: 50,
  quality: 50,
  fontSize: 57,
  offset: 40,
  charSpace: 20
};
var napObj = naptcha.of(options);
var nap = napObj.perform();
console.log(nap.text);
