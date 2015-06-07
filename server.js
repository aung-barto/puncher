var express = require('express');
var app = express();
var ejs = require('ejs');
app.set('view engine', 'ejs');
var request = require('request');
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("puncher.db");

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
  res.redirect('index.html');
});

app.get('/game', function(req, res){
  res.render('puncher.ejs');
});

app.get('/end', function(req, res){
  res.render('end.ejs');
});

app.listen(3000, function() {console.log('listening to port 3000');});