const Task = require('../models/tasks')
const catchAsyncError = require('../middlewares/catchAsyncError')

module.exports.create = catchAsyncError(async(req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).send(newTask);
})

module.exports.find = catchAsyncError(async(req, res) => {
    const tasks = await Task.find({});

    if(!tasks){
        return res.status(204).send();
    }

    res.status(200).send(tasks);
})

module.exports.findById = catchAsyncError(async (req, res) => {
    const _id = req.params.id;
    const task = await Task({id: _id});

    if(!task){
        return res.status(204).send()
    }

    res.status(200).send(task);
})
