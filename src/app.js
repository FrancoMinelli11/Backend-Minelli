import express from "express";
import userRouter from './routes/user.router.js'
import mongoose from "mongoose";
import { config } from "./config/config.js";
import __dirname from "./utils.js";
import handlebars from 'express-handlebars'
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/product.router.js";
import methodOverride from 'method-override'


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))

const urlMongo = config.URL_DB
const port = config.PORT

app.listen(port, () => {
    console.log(`Listen on PORT ${port}`)
})
mongoose.connect(urlMongo).then(() => {
    console.log('Connected to DB')
}).catch()

app.use('/users', userRouter)
app.use('/', viewsRouter)
app.use('/', productRouter)
