var express = require('express');

var parser = require('body-parser');
var request = require('request');
var sha1 = require('sha1');

var port = process.env.PORT || 3000;

var server = express();


server.use(parser.json());

var var1 = process.env.VAR1;
var var2 = process.env.VAR2;
var token;

server.get('/listeners', function (req, res) {
  var code = req.query.code;
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
    //console.log('Server responded with:', body);
    token = body.slice(body.indexOf('=') + 1, body.indexOf('&'));
  });
});

server.get('/branches', function (req, res) {
  console.log('get received');
  var url = 'https://api.github.com/repos/codingfitness/codingfitness/git/refs' + '?access_token=' + token;
  var options = {
    url: url,
    headers: {
      'User-Agent': 'mergeserver'
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.log("error", error);
    } else {
      console.log("showrefs", body);
    }
    console.log("all resp", response);
  });  
});

server.post('/listeners', function (req, res) {
  res.sendStatus(201);
  if (req.body.action === 'opened' || req.body.action === 'updated') {
  	// console.log("pullrequest", req.body.pull_request);
    if (req.body.pull_request.head.user.login === req.body.pull_request.base.ref) {
      var url = req.body.pull_request.url;
      var query = url+'/merge?access_token=' + token;
      console.log("query", query);
      var options = {
        url: query,
        headers: {
          'User-Agent': 'mergeserver'
        },
        body: JSON.stringify({commit_message: "Please merge"})
      };
      request.put(options, function (error, response, body) {
      	if (error) {
      	  console.log("error", error);
      	}
  	    console.log("response", response.statusCode);
  	    //console.log("responseTotal", response);
      });
    } 
  }
});

server.post('/branches', function (req, res) {
  res.sendStatus(201);
  console.log("branches", req.body);
  var newuser = req.body.forkee.owner.login;
  var newref = 'refs/heads/'+newuser;
  var oldref = 'refs/heads/master';
  var oldsha = 'fde1dc064adcae03946f75059c40b8da2175c571';
  var newsha = sha1(newuser);
  console.log("newdata", newref, newsha);
  var url = 'https://api.github.com/repos/codingfitness/codingfitness/git/refs' + '?access_token=' + token + '&ref=' + newref + '&sha=' + newsha;
  var options = {
    url: url,
    headers: {
      'User-Agent': 'mergeserver',
      'content-type': 'x-www-form-urlencoded'
    },
    method: 'POST'
    // body: JSON.stringify({
    //   ref: newref,
    //   sha: newsha
    // })
  };
  
  request(options, function (error, response, body) {
    if (error) {
      console.log("error", error);
    }
    console.log("response", response.statusCode);
    console.log("responseTotal", response);
  });

});


server.use(express.static(__dirname));

console.log('Listening on port' + port);
server.listen(port);
