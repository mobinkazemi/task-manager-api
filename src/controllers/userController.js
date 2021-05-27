const User = require('../models/user')
const catchAsyncError = require('../middlewares/catchAsyncError')

module.exports.signup = catchAsyncError(async (req, res) => {
    // const newUser = await User.create(req.body)
    // res.status(201).send(newUser);
    const newUser = await new User(req.body);
    
    if(!newUser){
        return res.status(204).send();
    }
    
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