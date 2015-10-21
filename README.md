# Introduction
A simple captcha for Node.js.

# Installation

``` bash
$ npm install naptcha
```

# Examples
express.js

``` javascript
var naptcha = require('naptcha');
var options = {
  dir: './node_modules',
  fileName: Date.now(),
  type: 'jpeg',
  width: 110,
  height: 65,
  quality: 50,
  fontSize: 57
};
var napObj = naptcha.of(options);
app.get('/naptcha', function (req, res) {
  var nap = napObj.perform();
  res.setHeader("Content-Type", "image/jpeg");
  nap.pipe(res);
  console.log(nap.text);
});
```

koa.js

``` javascript
router.get('/naptcha', function* (req, resp) {
  const nap = naptcha.perform();
  this.session.naptcha = nap.text;
  this.body = nap;
  this.type = 'image/jpeg';
});
```

# License
MIT
