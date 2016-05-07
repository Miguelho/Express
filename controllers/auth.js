var Account = require('../models/account.js');//contiene el schema que abstrae la colección Accounts en la bbdd.
var passport = require('passport');
var service = require('../service.js')

exports.emailSignup= function(req,res,next){
		console.log(req.body.username+" "+ req.body.password);
		//console.log(req.body);
		console.log("req.body.role " + req.body.role );
		Account.register(new Account({username:req.body.username}),req.body.password, function(err, account) {
        if (err) {
        	console.log("he petao");
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        passport.authenticate('local')(req, res, function () {
	    	console.log(req.body.username + " registrado correctamente");
	    	return res.status(200).send({token:service.createToken(Account)})

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

// Crear un nuevo controller middleware que es usado para autorizar una operación article 
exports.hasAuthorization = function(req, res, next) {
	// si el usuario actual no es el creador del artículo, enviar el mensaje de error apropiado

	console.log(req.headers);
	if (!req.headers['authorization']) {
		console.log("el user NO ! esta autorizado");

		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}else{
		console.log("el user esta autorizado" + req.headers['authorization']);
		return res.render("home");
		
	}

	// Llamar al siguiente middleware
	next();
};