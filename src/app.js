import {config} from "./config/config.js";
import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import productRouter from "./routes/product.router.js";
import viewsRouter from "./routes/views.router.js";
import cartRouter from "./routes/cart.router.js";
import methodOverride from "method-override"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'));
const port = config.PORT
const mongo_url = config.DB_URL

app.listen(port, () => console.log(`Listening on port ${port}`));

mongoose.connect(mongo_url)
.then(() => {console.log('Connected to DB')})
.catch();

app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/', viewsRouter)
