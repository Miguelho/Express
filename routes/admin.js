var express = require('express');
var passport = require('passport');
//Tokens tokens everywhere
var middleware = require('../middleware');
var adminCtrl = require('../controllers/admin.js'); 
var router = express.Router();

/* GET home page. */
router.route('/admin')
  .get(function(req, res, next) {
    console.log("pugAdmin");
    res.render('index', { title: 'Express' });
    /*res.render('index',{},function(err,html){
      res.send('completado');
    });*/

});
/* ROUTE /register HTTP VERBS*/
router.route('/registerAdmin')
	.get(function(req, res, next) {
  		res.render('register', {});
	})
	.post(adminCtrl.emailSignup);

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
  .get(middleware.ensureAuthenticated,function(req, res) {
      res.render('home', {});
  });
  //.post(authCtrl.emailLogin);

//router.route('private', middleware.ensureAuthenticated, function(req,res){} );

module.exports = router;
