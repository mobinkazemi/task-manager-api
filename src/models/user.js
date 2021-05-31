const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const catchAsyncError = require('../middlewares/catchAsyncError');

const  passwordContentChecker = (password) =>{
    const regex = /(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/

    return regex.test(password);
}

const hashPassword = async function (pass) {
    try {
    if(!(this.password === this.confirmPassword)){
        throw new Error('Passwords do not match')
    }
    let password = await bcrypt.hash(pass, 8);
    return password;

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
        
        
    },
    refreshToken: {
        type: String,
        
    }
});



userSchema.pre('save',async function (next){
    const user = this 
    let hashedPass = await hashPassword(user.password)
    user.password = hashedPass
    user.confirmPassword = undefined
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = {User};
