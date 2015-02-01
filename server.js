var express = require('express');

var parser = require('body-parser');


var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());


server.post('/listeners', function (req, res) {
  if (req.body.action === 'opened' || req.body.action === 'updated') {
  	console.log("user", req.body.pull_request.user);
    console.log("head", req.body.pull_request.head);
    console.log("base", req.body.pull_request.base);
  }
});
// server.post('/listeners', handler.post);


console.log('Listening on port' + port);
server.listen(port);
