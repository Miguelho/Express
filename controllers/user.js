var User = require('../models/user.js');//contiene el schema que abstrae la colección User en la bbdd.
var Account = require('../models/account.js');
var objectId= require('objectid');
var mongoose = require('mongoose');

exports.getUserId = function(req,res,next){
		console.log("req.params._id " + req.params._id);
		var param_id= String(req.params._id);
		var id = new mongoose.Types.ObjectId(param_id);
		console.log(id);
		console.log("es valido el id?" + objectId.isValid(id));
		Account.find({_id:id},function(err,data){
			if(err)
				res.send(err.message);
			else{
				//console.log("el nombre del usuario es "+ data[0]['username']);//data[0] xk devuelve un array de json
				res.status(200).json(data[0]);
			}

		});
	};