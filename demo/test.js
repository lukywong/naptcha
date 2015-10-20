var naptcha = require('../index');
var options = {
  path: './demo/',
  fileName: Date.now(),
  type: 'jpeg',
  width: 120,
  height: 65,
  quality: 50,
  fontSize: 57
};
var napObj = naptcha.of(options);
var nap = napObj.perform();
console.log(nap.text);
