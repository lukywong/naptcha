const naptcha = require('../index');
const nap = naptcha.of();
setInterval(function() {
  console.log(nap.perform());
}, 1000);
