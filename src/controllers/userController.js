const jwt = require('jsonwebtoken')
const User = require('../models/user')
const path = require('path')
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


module.exports.signup = catchAsyncError(async (req, res) => {
    // const newUser = await User.create(req.body)
    // res.status(201).send(newUser);
    const newUser = await new User(req.body);
    
    if(!newUser){
        return res.status(204).send();
    }
    
    newUser.accessToken = createAccessToken(newUser);
    newUser.refreshToken = createRefreshToken(newUser);

    await newUser.save()
    res.status(201).send(newUser);
    
})

module.exports.find = async (req, res) => {
    const users = await User.find({});

    if(!users){
        return res.status(204).send();
    }
    res.status(200).send(users);

}

module.exports.findById = async (req, res) => {
    const _id = req.params.id;
    const findOne = await User.find({_id: req.body.id})
    if(!findOne){
        return res.status(204).send();
    }
    
    res.status(200).send(findOne);
}