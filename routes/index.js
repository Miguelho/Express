var express = require('express');
var Account = require('../models/account.js');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.route('/').get(function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* ROUTE /register HTTP VERBS*/
router.route('/register')
	.get(function(req, res, next) {
  		res.render('register', {});
	})
	.post(function(req,res,next){
		console.log(req.body.password);
		Account.register(new Account({username:req.body.username}),req.body.password, function(err, account) {
        if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        passport.authenticate('local')(req, res, function () {
	    	console.log("Autenticado");
	    	//res.render('index')
	    	res.redirect('/');

        });
		});
	});
router.route('/login')
	.get(function(req, res) {
    	res.render('login', { user : req.user });

	})
	.post(passport.authenticate('local'), function(req, res, next) {
		//console.log(req.user);
    	//res.render('/',{user:req.user});
    	res.status(201).send({redirect:'/ping'});
    	
});


router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
