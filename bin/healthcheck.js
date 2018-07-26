#!/usr/bin/env node

var http = require('http');
var port = process.env.PORT || 3000;

http.get('http://localhost:' + port + '/healthcheck', function (resp) {
  var data = ''; // A chunk of data has been recieved.

  resp.on('data', function (chunk) {
    data += chunk;
  }); // The whole response has been received. Print out the result.

  resp.on('end', function () {
    if (data === 'OK') {
      console.log(data);
      process.exit(0);
    }
    console.error('UNKNOWN:', data);
    throw new Error(data);
  });
}).on('error', function (err) {
  console.log('Error: ' + err.message);
  process.exit(1);
});
