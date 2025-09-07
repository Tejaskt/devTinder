const express = require('express')
const connectDB = require("./config/database")
const app = express()
const User = require("./models/user")

app.post("/signup", async (req,res)=>{
    // creare a new instance of the User Model
    const user = new User({
        firstName : "Tejas",
        lastName : "kt",
        emailId : "Tejaskt@gmail.com",
        password : "kt@123",
        age : 23,
        gender : "male"
    })
    try{
        await user.save()
        res.send("user create Successfully...")
    }catch(err){
        res.status(400).send("error saving the user:" + err.message)
    }
})

connectDB().then(()=>{
    console.log("connection Successfully...!")

    app.listen(3001,() => {
    console.log("server is started in port 3001")
})
}).catch(err=>{
    console.error("db connection failed..!!")
})


