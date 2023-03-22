const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler( async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err){
                res.status(401);
                throw new Error("User is not authorized")
            }
            req.user = decoded
            next()
        })
        if(!token){
            res.status(404);
            throw new Error("Token is Not Valid")
        }
    }
    else{
        res.status(404)
        throw new Error("Only Authorized User Can Access!")
    }
})

module.exports = validateToken