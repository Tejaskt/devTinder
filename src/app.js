const express = require('express')
const connectDB = require("./config/database")
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');

app.use(express.json()) // when reading the req body, it will parse json data.
app.use(cookieParser()) // to parse the cookie while fetch it.


app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

connectDB().then(() => {
    console.log("connection Successfully...!")

    app.listen(3001, () => {
        console.log("server is started in port 3001")
    })
}).catch(err => {
    console.error("db connection failed..!!")
})


