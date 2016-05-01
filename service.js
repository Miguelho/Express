var jwt= require ('jwt-simple');
var moment = require('moment');//libreria para ayudarnos en el manejo de fechas.
var config = require ('./config.js');

exports.createToken= function(account){
	var payload={
		sub:account._id,
		iat:moment().unix(),
		exp:moment().add(14,"days").unix()
	}
	return jwt.encode(payload,config.TOKEN_SECRET); //Donde se codifica el JWT, con un header genérico, un payload, y la clave secreta

}