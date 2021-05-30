const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAsyncError = require('../middlewares/catchAsyncError');

function passwordContentChecker(password){
    const regex = /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/

    return regex.test(password);
}

const hashPassword = async function (next) {
    try {
    if(!(this.password === this.confirmPassword)){
        throw new Error('Passwords do not match')
    }
    this.password = await bcrypt.hash(this.password, 8);
    this.confirmPassword = undefined;
    next();
    } catch (err) {
        console.error(err);
    }
}

const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 16,
        unique: true,
        validate(n){
            if(!validator.isAlpha(n, 'en-US', {ignore: ' '})){
                throw new Error('name contains only letters');
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(e){
            if(!validator.isEmail(e)) throw new Error('Email not valid');
        }
    },
    password: {
        type: String,
        required: true, 
        validate(p){
            if(!passwordContentChecker(p)){
                throw new Error('password containt at least one upper-case letter, one Lower-case letter, one number')
            }

        }
    },
    confirmPassword: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true,
        
    },
    refreshToken: {
        type: String,
        required: true
    }
});


userSchema.pre('save', function (next){
    const user = this 
    if(!user.isModified('password')) return next();
    else hashPassword
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;