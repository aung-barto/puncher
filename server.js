var express = require('express');
var ejs = require('ejs');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({ extended: false}));
app.use(cors());

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("puncher.db");

//index page
app.get('/', function(req,res) {
  db.all("SELECT * FROM users", function(err, data){
    if(err){
      console.log(err);
    } 
    res.render("index.ejs", {users: data});
  });
});

// play game
app.get('/game', function(req, res){
  res.render('puncher.ejs');
});

//fail
app.get('/gameover', function(req, res){
  res.render('gameover.ejs');
});

//times up, show score and get user name
app.post('/timesup', function(req, res){
  console.log(req.body);
  db.run("INSERT INTO users (score) VALUES (?);", req.body.score, function(err){
    console.log("insert");
    if (err){
      throw err;
    }
    else{
      var id = this.lastID;
      console.log(id);
    };
    res.json({id: id});
  });
});

// //render times up page
app.get('/timesup/:id', function(req, res){
  db.get("SELECT * FROM users WHERE id = ?",req.params.id, function(err, row){
    console.log("get");
    if(err){
      throw err;
    }
    console.log(row);
    res.render('timesup.ejs', {score: row});
  });
});

app.put('/timesup/:id', function(req, res){
  if(req.params.username != 0){
    db.run("UPDATE users SET username = ? WHERE id = " + parseInt(req.params.id), req.params.username, function(err, data){
      if (err){
        throw err;
      }
    res.redirect('/');
    });
  }
})

app.listen(3000, function() {
  console.log('start punching!');
});