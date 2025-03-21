import { Router } from "express";
import { productModel } from "../models/product.model.js";
import { uploader } from "../utilsMulter.js";
const router = Router()

router.post('/product',uploader.single('file') ,async (req, res) => {
    try {
        const {name, description, price, code, thumbnail} = req.body
        if(!name || !description || !code || !price) return res.json({status:'error', message:'Faltan datos en la solicitud'})
            const createProduct = await productModel.create({
        name,
        description,
        price,
        code,
        thumbnail
    })
        if(req.file) createProduct.thumbnail = req.file.filename
        res.render('product', {product:createProduct.toObject()})
    } catch (error) {
        res.status(500).json({status:'error', message:error.message})
    }
})

router.get('/product/:code', async (req, res) => {
    try {
        const {code} = req.params
        const product = await productModel.findOne({code})
        if(!product) return res.json({status:'error', message:'Producto no encontrado'})
        res.render('product', {product:product.toObject()})
    } catch (error) {
        res.status(500).json({status:'error', message:error.message})
    }
})

router.get('/product', async (req, res) => {
    try {
        const products = await productModel.find().lean()
        console.log({products})
        res.render('products', {products:products})
    } catch (error) {
        res.status(500).json({status:'error', message:error.message})
    }
})

router.delete('/product/:_id', async (req, res) => {
    try {
        const {_id} = req.params
        const productToDelete = await productModel.findByIdAndDelete(_id)
        if(!productToDelete) return res.json({status:'error', message: 'No existe este producto'})
            res.redirect('/products')
    } catch (error) {
        
    }

})

export default router
