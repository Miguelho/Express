var express = require('express');
var Account = require('../models/account.js');
var passport = require('passport');
//Tokens tokens everywhere
var middleware = require('../middleware');
var authCtrl = require('../controllers/auth.js'); 
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(function(req, res, next) {
    console.log("pug");
    res.render('index', { title: 'Express' });
    /*res.render('index',{},function(err,html){
      res.send('completado');
    });*/

});
/* ROUTE /register HTTP VERBS*/
router.route('/register')
	.get(function(req, res, next) {
  		res.render('register', {});
	})
	.post(authCtrl.emailSignup);

router.route('/login')
	.get(function(req, res) {
    	res.render('login', { user : req.user });
	})
	.post(authCtrl.emailLogin);
    	
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.route('/home')
  .get(authCtrl.hasAuthorization,function(req, res) {
      res.render('home', {});
  });
  //.post(authCtrl.emailLogin);

//router.route('private', middleware.ensureAuthenticated, function(req,res){} );

module.exports = router;
