var express = require('express');

var parser = require('body-parser');
var request = require('request');

var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());


server.post('/listeners', function (req, res) {
  res.sendStatus(201);
  if (req.body.action === 'opened' || req.body.action === 'updated') {
  	console.log("pullrequest", req.body.pull_request);
    if (req.body.pull_request.head.user.login === req.body.pull_request.base.ref) {
      var number = req.body.pull_request.number;
      var query = 'https://api.github.com/repos/codingfitness/codingfitness/pulls/'+number+'/merge';
      console.log("query", query);
      var options = {
        url: query,
        headers: {
          'User-Agent': 'azotova'
        }
      };
      request.put(options, function (error, response, body) {
      	if (error) {
      	  console.log("error", error);
      	}
  	    console.log("response", response.statusCode);
  	    console.log("responseTotal", response);
      });
    } 
  }
});

console.log('Listening on port' + port);
server.listen(port);
