var Account = require('../models/account.js');//contiene el schema que abstrae la colección Accounts en la bbdd.
var passport = require('passport');
var service = require('../service.js')

exports.emailSignup= function(req,res,next){
		console.log(req.body.password);
		Account.register(new Account({username:req.body.username}),req.body.password, function(err, account) {
        if (err) {
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        passport.authenticate('local')(req, res, function () {
	    	console.log("Autenticado");
	    	return res.status(200).send({token:service.createToken(Account)})
	    	//res.render('index')
	    	//res.redirect('/');

        });
		});
	};

exports.emailLogin= function(req,res,next){
	passport.authenticate('local'), function(req, res, next) {
		//console.log(req.user);
    	//res.render('/',{user:req.user});
    	return res.status(200).send({token:service.createToken(account)})
    	//res.status(201).send({redirect:'/ping'}
	};
};