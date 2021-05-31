const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const path = require('path')
const bcrypt = require('bcryptjs')
require('dotenv').config({ path: path.resolve(__dirname, '../../src/.env') })
const catchAsyncError = require('../middlewares/catchAsyncError')

const createAccessToken = (user, expireTime = "1h") => {
    const accessToken = jwt.sign({username: user.username, password: user.password}, process.env.ACCESS_TOKEN_SECRET,{
        issuer: 'access',
        expiresIn: expireTime
    })

    return accessToken;
}

const createRefreshToken = (user, expireTime = "7d") => {
    const refreshToken = jwt.sign({username: user.username, password: user.password}, process.env.REFRESH_TOKEN_SECRET, {
        issuer: "refresh",
        expiresIn: expireTime
    })

    return refreshToken;
}

const jwtTokenValidationChecker = async (token, secret) => {
    try {
        const stillValid = await jwt.verify(token, secret)
        if(stillValid) return true 
    } catch (e) {
        console.log('token expired')
        return false
    }
}

const compareHashedPassword = async(user, enteryPassword) => {
    await bcrypt.compare(enteryPassword, user.password, (err, isValid) =>{
        if(err){
            console.log('error accured in compareHashedPassword: \n\n\n', err)
        }
        
        return isValid
    })
}



module.exports.signup = catchAsyncError(async (req, res) => {
    // const newUser = await User.create(req.body)
    // res.status(201).send(newUser);
    const user_toSignUp = await new User(req.body);
    
    if(!user_toSignUp){
        return res.status(204).send();
    }
    
    user_toSignUp.accessToken = createAccessToken(user_toSignUp);
    user_toSignUp.refreshToken = createRefreshToken(user_toSignUp);

    await user_toSignUp.save()
    res.status(201).send({
        message: "New User created. Now you can Login...",
        data: {
            user_toSignUp
        }
    });
    
})


module.exports.signin = catchAsyncError(async(req, res) => {
    
    const {username, password} = req.body
    
    if(!username || !password){
        res.status(400).send('Missing username or password')
    }

    const user_toLogIn = await User.findOne({username: {$regex: RegExp(username)}})

    if(!user_toLogIn){
        res.status(404).send('User not found')
    }
    
    const passwordPared = compareHashedPassword(user_toLogIn, password);

    if(!passwordPared){
        res.status(400).send('Wrong password');
    }


    if(jwtTokenValidationChecker(user_toLogIn.accessToken, process.env.ACCESS_TOKEN_SECRET)){
        user_toLogIn.accessToken = createAccessToken(user_toLogIn)
        user_toLogIn.refreshToken = createRefreshToken(user_toLogIn)
        return res.status(200).send({
            message: 'User logged in. Use the token to manage your tasks',
            token: user_toLogIn.accessToken
        })
    }else if(jwtTokenValidationChecker(user_toLogIn.refreshToken, process.env.REFRESH_TOKEN_SECRET)){
        user_toLogIn.accessToken = createAccessToken(user_toLogIn)
        user_toLogIn.refreshToken = createRefreshToken(user_toLogIn)

        return res.status(200).send({
            message: 'User logged in. Use the token to manage your tasks',
            token: user_toLogIn.accessToken
        })
    } else{
        user_toLogIn.accessToken = createAccessToken(user_toLogIn)
        user_toLogIn.refreshToken = createRefreshToken(user_toLogIn)

        return res.status(200).send({
            message: 'User logged in. Use the token to manage your tasks',
            token: user_toLogIn.accessToken
        })
    }
})