const mongoose = require('mongoose');
const validator = require('validator');
const chalk = require('chalk');

const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isAlpha(value, 'en-US', {ignore: ' '})){
                throw new Error(chalk.bgRed('Name can only include characters'));
            }
        }
    },
    age: {
        type: Number,
        required: false,
        default: 1,
        validate(value){
            if(value < 1){
                throw new Error(chalk.bgRed('Age can not be less or equal than 0'));
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error(chalk.bgRed('Email format is not valid'));
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error(chalk.bgRed('password can not contain \'password\' keyword'));
            }
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;