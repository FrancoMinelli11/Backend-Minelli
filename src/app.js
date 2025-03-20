import express from "express";
import userRouter from './routes/user.router.js'
import mongoose from "mongoose";
import { config } from "./config/config.js";
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const urlMongo = config.URL_DB
const port = config.PORT

app.listen(port, () => {
    console.log(`Listen on PORT ${port}`)
})
mongoose.connect(urlMongo).then().catch()

app.use('/users', userRouter)
