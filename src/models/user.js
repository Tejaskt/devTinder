const mongoose = require('mongoose')
const validator = require('validator')

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

module.exports = mongoose.model("User",userSchema)