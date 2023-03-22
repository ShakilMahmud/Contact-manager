const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

const registration = asyncHandler(async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassWord = await bcrypt.hash(req.body.password, salt)

    const createUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassWord,
        role: req.body.role
    })

    try{
        await createUser.save()
        res.status(201).json({
            "success": true,
            "message": "Registration Successful!!",
            data:{
                name:createUser.name
            }
        })
    }
    catch(err){
        res.status(400);
        throw new Error(err.message);
    }
})
const login = asyncHandler( async (req, res) => {
    if(!req.body.email || !req.body.password){
        res.status(400);
        throw new Error("Email and Password both are required!")
    }
    const user = await User.findOne({email:req.body.email})
    if(!user){
        res.status(404);
        throw new Error("User is not registered!")
    }
    const match = await bcrypt.compare(req.body.password, user.password)
    if(!match){
        res.status(401);
        throw new Error("Email or Password not matched!")
    }
    const authToken = jwt.sign({
                                _id:user._id,
                                name:user.name,
                                email:user.email,
                                role:user.role
                            },process.env.SECRET,{expiresIn: "1h"})
       if(!authToken){
            res.status(500);
            throw new Error("Something went wrong!")
       }
     res.status(201).header('auth-token', authToken).send(authToken)

})


const currentUser =  (req, res) => {
    res.status(200).json({
        success: true,
        data:{
            user:req.user
        }
    })
}



module.exports = { registration, login, currentUser }