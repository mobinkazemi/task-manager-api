const Task = require('../models/tasks')
const jwt = require('jsonwebtoken');
const catchAsyncError = require('../middlewares/catchAsyncError')

const extractAuthPayload = async (req) => {
    const tokenInHeader = req.headers['authorization']
    const token = tokenInHeader && tokenInHeader.split(' ')[1]
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    return payload
}

module.exports.create = catchAsyncError(async(req, res) => {
    const payload = await extractAuthPayload(req)
    const newTask = new Task(req.body);
    console.log(payload)
    newTask.owner = payload.username
    await newTask.save();
    
    res.status(201).send(newTask);
})

module.exports.findAll = catchAsyncError(async(req, res) => {
    const payload = await extractAuthPayload(req);

    const tasks = await Task.find({owner: {$regex: RegExp(payload.username+"d")}});

    res.status(200).send(tasks);
})

module.exports.findByTitle = catchAsyncError(async (req, res) => {
    const title = req.body.title
    const {username} = await extractAuthPayload(req)

    const tasks = await Task.find({
        title: {$regex: RegExp(title)},
        owner: {$regex: RegExp(username)}
    })

    res.status(200).send(tasks);
})
