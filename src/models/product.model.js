import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: Number,
        required: true,
        unique: true
    },
    thumbnail: {
        type: String
    },
    // stock: {
    //     type: Number,
    //     required: true
    // },
    // category: {
    //     type: String,
    //     required: true
    // }
})

export const productModel = mongoose.model(productCollection, productSchema)