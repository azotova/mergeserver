var express = require('express');

var parser = require('body-parser');
var request = require('request');

var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());

var var1 = process.env.VAR1;
var var2 = process.env.VAR2;
var token;

server.get('/listeners', function (req, res) {
  var code = req.query.code;
  console.log("numbers", var1, var2, code);
  var options = {
  	method: 'POST',
  	uri: 'https://github.com/login/oauth/access_token',
  	headers: {
  	  'content-type': 'application/json' 	  
  	},
  	body: JSON.stringify({
  	  client_id: var1,
      client_secret: var2,
      code: code
    })
  };
  request(options, function (error, response, body) {
    if (error) {
      console.log('post request failed:', error);
    }
    console.log('Server responded with:', body);
    console.log('responseToCheck', response);

    )
  });
})

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

server.use(express.static(__dirname));

console.log('Listening on port' + port);
server.listen(port);
