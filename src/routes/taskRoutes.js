const express = require('express')
const taskController = require('../controllers/taskController');
const { tokenValidation } = require('../middlewares/tokenValidation');

const router = express.Router();

router.post('/create', tokenValidation, taskController.create);

router.get('/findAll', tokenValidation, taskController.findAll);

router.get('/findByTitle', tokenValidation, taskController.findByTitle);

// router.get ('/findByTitle:title', taskController.findByTitle);

module.exports = router