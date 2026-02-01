const express = require('express')
const connectDB = require("./config/database")
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');
const userRouter = require('./routers/user');
const chatrouter = require('./routers/chat'); //new
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})) // to allow cross origin requests
app.use(express.json()) // when reading the req body, it will parse json data.
app.use(cookieParser()) // to parse the cookie while fetch it.


app.use("/auth", authRouter)
app.use("/profile", profileRouter)
app.use("/request", requestRouter)
app.use("/user", userRouter)
app.use("/",chatrouter) // new

connectDB().then(() => {
    console.log("connection Successfully...!")

    app.listen(3001, () => {
        console.log("server is started in port 3001")
    })
}).catch(err => {
    console.error("db connection failed..!!")
})


