var Admin = require('../models/admin.js');//contiene el schema que abstrae la colección Accounts en la bbdd.
var passport = require('passport');
var service = require('../service.js')


exports.emailSignup= function(req,res,next){
		Admin.register(new Admin({username:req.body.username}),req.body.password, function(err, adminAccount) {
        if (err) {
        	console.log("Error en el registro");
            return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
        passport.authenticate('local')(req, res, function () {
	    	console.log(req.body.username+ " correctamente autenticado como Admin");
	    	return res.status(200).send({token:service.createToken(Admin)})

        });
		});
	};

exports.emailLogin= function(req,res,next){
	console.log(req.headers);
	//passport.authenticate('local',{ successRedirect: '/', failureRedirect: '/login' }, function(req, res, next) {
	passport.authenticate('local', function(err, admin) {
		if (err) {
			console.log("error de la autenticación");
			return res.status(401).send({message:"errorRRR!"});
		}
		if (!admin) { console.log("No existe este admin, por favor, registrese");
			return res.status(401).send({message:"Este Administrador no existe, por favor registrese"});
		}else{
			console.log("Logeado como administrador");
    		return res.status(200).send({token:service.createToken(Admin)})
    		
		}

	})(req, res);;
};