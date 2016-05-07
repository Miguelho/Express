var express = require('express');
var router = express.Router();

var User = require('../models/user.js');//contiene el schema que abstrae la colección User en la bbdd.
var UserCtrl = require('../controllers/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//router.route('/:_id')
router.route('/:username')
	.get(UserCtrl.getIdByUsername)

module.exports = router;
