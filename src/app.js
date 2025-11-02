const express = require('express')
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');

app.use(express.json())

app.post("/signup", async (req, res) => {

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

app.post("/login", async(req,res) => {

    try{
        
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if(!user){
            throw new Error("user is not present")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(isPasswordValid){
            res.send("Login Successfull...!!")
        }else{
            throw new Error("password is not correct...!!")
        }
    }catch(err){
        res.status(400).send("error Login the User: " + err.message)
    }
})


connectDB().then(() => {
    console.log("connection Successfully...!")

    app.listen(3001, () => {
        console.log("server is started in port 3001")
    })
}).catch(err => {
    console.error("db connection failed..!!")
})


