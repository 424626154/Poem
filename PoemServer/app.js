var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var users = require('./routers/users');
var poem = require('./routers/poem');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', function(req, res){
  res.send('hello world');
});

app.use('/users', users);
app.use('/poem', poem);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});