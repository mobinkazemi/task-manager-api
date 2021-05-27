const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router();

router.post('/signup', userController.signup);

router.get('/find', userController.find);

router.get('/findById:id', userController.findById);

module.exports = router;