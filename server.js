var express = require('express');
// var passport = require('passport');
// var util = require('util');
// var FacebookStrategy = require('passport-facebook').Strategy;
// var logger = require('morgan');
// var session = require('express-session');
var ejs = require('ejs');
var request = require('request');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var methodOverride = require('method-override');

var app = express();
//configure Express
app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');
// app.use(logger());
// app.use(cookieParser());
// app.use(methodOverride());
// app.use(session({ secret: 'keyboard cat'}));

//initialize passport
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// var FACEBOOK_APP_ID = "";
// var FACEBOOK_APP_SECRET = "";
// var sqlite3 = require("sqlite3").verbose();
// var db = new sqlite3.Database("puncher.db");

// passport.serializeUser(function(user, done){
//   done(nusll, user);
// });

// passport.deserializeUser(function(user, done){
//   done(null, user);
// });

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3000/auth/facebook/callback",
//     enableProof: false
//   },
//   function(accessToken, refreshToken, profile, done){
//     User.findOrCreate({ facebookId: profile.id }, function(err, user){
//       return done(err, user);
//     });
//   }
// ));

// app.get('/', function(req,res) {
//   res.redirect('index.html', {user: req.user});
// });

// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', {user: req.user});
// });

// app.get('/login', function(req, res){
//   res.render('login', {user: req.user});
// });

// //redirecting users to facebook.com
// app.get('/auth/facebook',
//   passport.authenticate('facebook'));
// //check authentication, if fails, go back to login page
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', {failureRedirect: '/login'}),
//   function(req, res){
//     res.redirect('/');
//   });

// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

app.get('/game', function(req, res){
  res.render('puncher.ejs');
});

app.get('/gameover', function(req, res){
  res.render('gameover.ejs');
});

app.get('/timesup', function(req, res){
  res.render('timesup.ejs');
});

app.listen(3000, function() {
  console.log('start punching!');
});

// function ensureAuthenticated(req, res, next){
//   if(req.isAuthenticated()) {return next();
//   }
//   res.redirect('/login');
// }