const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required: true
    },
    lastName: {
        type : String
    },
    emailId: {
        type : String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id")
            }
        }
 },
    password: {
        type : String,
        required: true
    },
    age: {
        type : Number
    },
    gender: {
        type : String,
        validate(value){
            if(!["male","female","other"].includes(value.toLowerCase())){
                throw new Error("Invalid gender data")
            }
        }
    },
    photoUrl: {
        type : String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
    },
    about: {
        type : String,
        default: "Hey there! I am using DevTinder app."

    },
    skills: {
        type : [String],
        maxlength: 5
    }
},{
    timestamps: true
})


userSchema.methods.getJWT = async function() {
    const user = this
    const token = await jwt.sign({ _id : user._id}, "Tejaskt" , {
        expiresIn : "7d"
    })
    return token
}

userSchema.methods.passwordcheck = async function(password) {
    const user = this
    const isPasswordValid = await bcrypt.compare(password, user.password)
    return isPasswordValid
}

module.exports = mongoose.model("User",userSchema)