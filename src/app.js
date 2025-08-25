const express = require('express')

const app = express()

app.use((req,res,next)=>{
    res.send("hello from the server!!!")
    next()
},(req,res,next)=>{
    // req handle 2 
    res.send("hello from req handle 2")
}
)

app.listen(3001,() => {
    console.log("server is started in port 3001")
})