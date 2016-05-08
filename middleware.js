var jwt= require ('jwt-simple');
var moment = require('moment');//libreria para ayudarnos en el manejo de fechas.
var config = require ('./config.js');
var helper = require ('./helper.js')
var middleware= module.exports;

middleware.ensureAuthenticated= function(req,res,next){
	//res.headers.authorization = aprox: Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbsciOiJIUzI1NiJ9.eyJzdWIiOiIWeRtU2ZWMyYjUyNjgxNzE2YmXiNzAxMzIiLCJpYXQiOjE0Mj10MjA0OTEsImV4cCI6MTQy67YzMDA5MX0.IH7ek7Rp_WQJvXeOd8zrBIpeFi4W6kUi_6htmaxv7Ow
	
  console.log(req.headers);
  if(!req.headers.authorization){ //se comprueba si la cabecera lleva autorización. ( esto lo envía el front end)
		console.log("req user " +req.user);
		return res.status(403).send({message:"No tienes la cabecera de autenticación"});
	}
  console.log("pasado " +  req.headers.authorization)
//var token= req.headers.authorization.split(".");
//var token= req.headers.authorization.split(".")[1];
var tokenAuthorization= req.headers.authorization;
//var payload= jwt.decode(token,config.TOKEN_SECRET);

var payload = jwt.decode(tokenAuthorization,config.TOKEN_SECRET);

if(payload.exp <= moment().unix()){
	return res.status(401).message({message:"el token ha expirado"});
}

req.user = payload.sub;

next();
}
/*
module.exports = {
  decodeJwt: function (token) {
    var segments = token.split('.');

    if (segments.length !== 3) {
      throw new Error('Not enough or too many segments');
    }

    // All segment should be base64
    var headerSeg = segments[0];
    var payloadSeg = segments[1];
    var signatureSeg = segments[2];

    // base64 decode and parse JSON
    var header = JSON.parse(base64urlDecode(headerSeg));
    var payload = JSON.parse(base64urlDecode(payloadSeg));

    return {
      header: header,
      payload: payload,
      signature: signatureSeg
    }

  }
}

function base64urlDecode(str) {
  return new Buffer(base64urlUnescape(str), 'base64').toString();
};

function base64urlUnescape(str) {
  str += Array(5 - str.length % 4).join('=');
  return str.replace(/\-/g, '+').replace(/_/g, '/');
}*/