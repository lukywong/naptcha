# Introduction
A simple captcha for Node.js, support node 0.10.x, 0.12.x, 4.x and 5.0. Support Mac OS X and Linux.

# How to build
Make sure install nodejs before building.
``` bash
$ npm run build
```

# Run demo
``` bash
$ npm run demo
```

# Installation
Install [ImageMagick](http://www.imagemagick.org/script/index.php) before install naptcha on Linux.

``` bash
$ apt-get install ImageMagick
```

``` bash
$ npm install naptcha
```

# Examples
express.js

``` javascript
var naptcha = require('naptcha').of();
app.get('/naptcha', function (req, res) {
  var nap = naptcha.perform();
  res.setHeader("Content-Type", "image/jpeg");
  res.end(nap.bytes, 'binary');
  res.body = nap.bytes;
});
```

koa.js

``` javascript
router.get('/naptcha', function* (req, resp) {
  const nap = naptcha.perform();
  this.session.naptcha = nap.text;
  this.body = nap.bytes;
  this.type = 'image/jpeg';
});
```

# License
MIT
