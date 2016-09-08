var http = require('http');
var fs = require('fs');

var INTERVAL = 1000 * 60 * 60 * 24; // a day

main();

setInterval(main, INTERVAL)

function main() {
  return request('http://www.bing.com/', (err, body) => {
    if (err) throw err;

    var imgUrl = (body.match(/(\/az\/hprichbg\/rb\/[^"]+)/) || [])[0];

    if (imgUrl) {
      var fullImgUrl = 'http://www.bing.com/' + imgUrl;
      var filePath = `C:\\Users\\neild\\Pictures\\desktop_bg\\${getDate()}.jpg`;
      var writeStream = fs.createWriteStream(filePath);

      return http.get(fullImgUrl, (res) => {
        res.pipe(writeStream);
        res.on('end', () => {
          console.log('INFO: Downloaded: ' + fullImgUrl);
        });
      });
    } else {
      console.log('ERROR: image not found');
    }
  });
}

function getDate() {
  return (new Date()).toISOString().replace(/T.+/, '')
}

function request(url, cb) {
  http.get(url, (res) => {
    var bodyBuff = [];

    res.on('data', function(chunk) {
      bodyBuff.push(chunk)
    })

    res.on('end', function(buf) {
      var body = Buffer.concat(bodyBuff).toString();
      bodyBuff = null;
      return cb(null, body);
    })

    res.resume();

  }).on('error', (e) => {
    return cb(e);
  });
}