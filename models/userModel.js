const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique:true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    role:{
        type: String,
        enum: {
            values: ['admin', 'staff', 'user'],
            message: 'User is either admin, staff, user.'
        },
        default: 'user',
        trim: true
    }
},
   {
    timestamps: true
   }
)

module.exports = mongoose.model("User", userSchema)