const express = require('express')
const authRouter = express.Router();    
const User = require("../models/user");
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {

    try {
        // validate the incoming data
        const { isValid, message } = validateSignUpData(req);
        
        if (!isValid) {
            return res.status(400).send(message);
        }

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password before saving 
        const passwordHash = await bcrypt.hash(password, 10);

        // creare a new instance of the User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })

        await user.save()
        res.send("user create Successfully...")
    } catch (err) {
        res.status(400).send("error saving the user:" + err.message)
    }
})

authRouter.post("/login",async(req,res) => {

    try{
        
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })

        if(!user){
            throw new Error("user is not present")
        }
        
        const isPasswordValid = await user.passwordcheck(password)
        
        if(isPasswordValid){
            // Set the user ID in the cookies
            const token = await user.getJWT()

            res.cookie("token",token , {
                expires: new Date(Date.now() + 86400000), // 1 day
            })

            res.json({
                message: "Login Successful...!!",
                data:user
            })
        }else{
            throw new Error("password is not correct...!!")
        }
    }catch(err){
        res.status(400).send("error Login the User: " + err.message)
    }
})

authRouter.post("/logout", (req, res) => {
    try {
        res.clearCookie("token").send("Logout Successful...!!")
    } catch (err) {
        res.status(400).send("Error Logging out the User: " + err.message)
    }
})  

module.exports = authRouter;