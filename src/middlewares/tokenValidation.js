const jwt = require('jsonwebtoken')

const jwtTokenValidationChecker = async (token, secret) => {
    try {
        const stillValid = await jwt.verify(token, secret)
        if(stillValid) return true 
    } catch (e) {
        console.log('token expired')
        return false
    }
}

module.exports.tokenValidation = async (req, res, next) => {
    const tokenInHeader = req.headers['authorization']
    const token = tokenInHeader && tokenInHeader.split(' ')[1]
    
    if(jwtTokenValidationChecker(token, process.env.ACCESS_TOKEN_SECRET)){
        next()
    }else{
        res.status(401).send('token not authorized');
    }
}