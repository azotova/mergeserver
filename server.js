var express = require('express');

var parser = require('body-parser');
var request = require('request');

var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());


server.post('/listeners', function (req, res) {
  res.sendStatus(201);
  if (req.body.action === 'opened' || req.body.action === 'updated') {
  	/*console.log("user", req.body.pull_request.user);
    console.log("head", req.body.pull_request.head);
    console.log("base", req.body.pull_request.base);*/
    if (req.body.pull_request.head.user.login === req.body.pull_request.base.ref) {
      var number = req.body.pull_request.number;
      var query = 'https://api.github.com/repos/codingfitness/codingfitness/pulls/'+number+'/merge';
      request.put(query, function (error, response, body) {
  	    console.log("response", response.statusCode);
      });
    } 
  }
});

console.log('Listening on port' + port);
server.listen(port);
