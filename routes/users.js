var express = require('express');
var router = express.Router();
var middleware = require ('../middleware.js');

var User = require('../models/user.js');//contiene el schema que abstrae la colección User en la bbdd.
var UserCtrl = require('../controllers/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//router.route('/user/listUsers')
router.route('/listUsers')
	.get(middleware.ensureAuthenticated,UserCtrl.listUsers);

//router.route('/user/:_id')
router.route('/:_id')
	.get(middleware.ensureAuthenticated,UserCtrl.getIdByUsername)
	.delete(middleware.ensureAuthenticated,UserCtrl.deleteUser);


module.exports = router;
