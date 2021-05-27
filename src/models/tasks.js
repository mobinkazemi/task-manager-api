const chalk = require('chalk');
const mongoose = require('mongoose');

const {Schema} = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 2
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;