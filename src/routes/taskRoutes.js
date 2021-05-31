const express = require('express')
const taskController = require('../controllers/taskController');
const { tokenValidation } = require('../middlewares/tokenValidation');

const router = express.Router();

router.post('/create', tokenValidation, taskController.create);

router.get('/find', tokenValidation, taskController.find);

router.get('/findById:id', tokenValidation, taskController.findById);

// router.get ('/findByTitle:title', taskController.findByTitle);

module.exports = router