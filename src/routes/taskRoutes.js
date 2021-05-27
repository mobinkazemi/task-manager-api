const express = require('express')
const taskController = require('../controllers/taskController')

const router = express.Router();

router.post('/create', taskController.create);

router.get('/find', taskController.find);

router.get('/findById:id', taskController.findById);

// router.get ('/findByTitle:title', taskController.findByTitle);

module.exports = router