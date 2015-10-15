var naptcha = require('../index');
var options = {
  path: './demo/',
  fileName: Date.now(),
  type: 'jpeg',
  width: 170,
  height: 65,
  quality: 50,
  fontSize: 57,
  offset: 40 //space between characters
};
var nap = naptcha.of(options);
nap.perform();
