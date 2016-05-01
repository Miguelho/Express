var jwt= require ('jwt-simple');
var moment = require('moment');//libreria para ayudarnos en el manejo de fechas.
var config = require ('./config.js');

exports.ensureAuthenticated= function(req,res,next){
	//res.headers.authorization = aprox: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbsciOiJIUzI1NiJ9.eyJzdWIiOiIWeRtU2ZWMyYjUyNjgxNzE2YmXiNzAxMzIiLCJpYXQiOjE0Mj10MjA0OTEsImV4cCI6MTQy67YzMDA5MX0.IH7ek7Rp_WQJvXeOd8zrBIpeFi4W6kUi_6htmaxv7Ow
	if(!req.headers.authorization){ //se comprueba si la cabecera lleva autorización. ( esto lo envía el front end)
		return res.status(403).send({message:"No tienes la cabecera de autenticación"});
	}

var token= req.headers.authorization.split(".")[1];

var payload= jwt.decode(token,config.TOKEN_SECRET);

if(payload.exp <= moment().unix()){
	return res.status(401).message({message:"el token ha expirado"});
}

req.user = payload.sub;

next();
}