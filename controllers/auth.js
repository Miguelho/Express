var Account = require('../models/account.js');//contiene el schema que abstrae la colección Accounts en la bbdd.
var passport = require('passport');
var service = require('../service.js')

exports.emailSignup= function(req,res,next){
		console.log(req.body.username+" "+ req.body.password);
		Account.register(new Account({username:req.body.username}),req.body.password, function(err, account) {
        if (err) {
        	console.log("he petao");
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
	console.log(req.headers);
	//passport.authenticate('local',{ successRedirect: '/', failureRedirect: '/login' }, function(req, res, next) {
	passport.authenticate('local', function(err, user) {
		if (err) {
			console.log("error de la autenticación");
			return res.status(401).send({message:"errorRRR!"});
		}
		if (!user) { console.log("Que te peines!");
			return res.status(401).send({message:"errorRRR!"});
		}else{
			console.log("logeado");
    		return res.status(200).send({token:service.createToken(Account)})
    		
		}
    	//res.status(201).send({redirect:'/ping'}
	})(req, res);;
};