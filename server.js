var express = require('express');

var parser = require('body-parser');


var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());


server.post('/listeners', function (req, res) {
  console.log("show", req);
});
// server.post('/listeners', handler.post);


console.log('Listening on port' + port);
server.listen(port);
