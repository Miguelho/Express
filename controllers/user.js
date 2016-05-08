var User = require('../models/user.js');//contiene el schema que abstrae la colección User en la bbdd.
var Account = require('../models/account.js');
var objectId= require('objectid');
var mongoose = require('mongoose');

exports.getIdByUsername = function(req,res,next){
		console.log("req.params.username " + req.params.username);
		var paramNombre= String(req.params.username);
		var username = new mongoose.Types.ObjectId(paramNombre);
		console.log(username);
		console.log("es valido el username?");
		Account.find({username:username},function(err,data){
			if(err)
				res.send(err.message);
			else{
				//console.log("el nombre del usuario es "+ data[0]['username']);//data[0] xk devuelve un array de json
				res.status(200).json(data[0]);
			}

		});
	};

exports.listUsers = function(req,res,next){
		console.log("Serve users list");
		Account.find({},function(err,data){
			if(err)
				res.send(err.message);
			else{
				res.status(200).json(data);
			}

		});
	};


//params
exports.deleteUser = function(req,res,next){
	if(!req.params._id) return res.status(400).json({message:"Por favor,rellena el campo nombre"});
	console.log(req);
	var idUsuario=req.params._id;
	console.log("Borrando a "+ idUsuario);
	Account.remove({'_id': idUsuario},function(err,data){
		if (err) return err;
		if (data!== null)
			res.json({message: 'Se ha borrado correctamente'});
	});
};