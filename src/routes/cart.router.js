import { Router } from "express";
import { cartModel } from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

const router = Router()

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartModel.findById({ _id: cartId }).lean()
        const total = cart.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
        res.render('cart', { cart: cart.products, total })
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { product, user, email } = req.body
        if (!user, !email) return res.json({ status: 'error', message: 'Faltan datos en la creación del carrito' })
        const productExist = await productModel.findById({ _id: product })
        if (!productExist) return res.json({ status: 'error', message: 'El producto no existe' })
        const createCart = await cartModel.create({
            user,
            email,
            products: [{
                product,
                quantity: 1,
            }]
        })
        res.json({ cart: createCart.toObject() })
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        console.log(cid, pid)
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'El carrito no existe' });
        }
        const productExist = cart.products.some(p => p.product._id.toString() == pid);
        if (!productExist) {
            return res.status(404).json({ status: 'error', message: 'El producto no existe en el carrito' });
        }
        const updateCart = await cartModel.findByIdAndUpdate(
            cid,
            { $pull: { products: { product: pid } } },
            { new: true }
        );

        return res.json({
            status: 'success',
            payload: updateCart
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { product, quantity } = req.body;

        const cart = await cartModel.findById(cid).lean(); 
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'El carrito no existe' });
        }

        const quantityNumber = Number(quantity);
        if (isNaN(quantityNumber) || quantityNumber <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número válido y mayor a 0' });
        }

        const existingProduct = cart.products.find(p => p.product && p.product._id && p.product._id.toString() === product);

        if (existingProduct) {
            const updatedCart = await cartModel.findByIdAndUpdate(
                cid,
                {
                    $inc: { "products.$[elem].quantity": quantityNumber }
                },
                {
                    new: true,
                    arrayFilters: [{ "elem.product": product }] 
                }
            );
            return res.json({
                status: 'success',
                payload: updatedCart
            });
        } 

        const updatedCart = await cartModel.findByIdAndUpdate(
            cid,
            { $push: { products: { product, quantity: quantityNumber } } },
            { new: true }   
        );

        return res.json({
            status: 'success',
            payload: updatedCart
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});


router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findByIdAndDelete(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'El carrito no existe' });
        }
        return res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router