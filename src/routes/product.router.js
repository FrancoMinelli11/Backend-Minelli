import { Router } from "express";
import { uploader } from "../utilsMulter.js";
import productModel from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1
    const sort = req.query.sort == 'desc' ? -1 : 1 
    let category = req.query.category 
    if (!category) category = ''
    const toUpper = () => {
        let first_letter = category.charAt(0).toUpperCase()
        const word = category.slice(1)
        return category = first_letter + word
    }
    toUpper()
    const query = category ? {category} : {}
    console.log(limit, page, category)
    const products = await productModel.paginate(
        query,
        {
            limit: limit,
            page: page,
            sort:{price:sort},
            lean: true
        },)
    const docs = products.docs
    console.log(docs)
    res.render('index', { products: docs })
});

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body
        const img = req.file.filename
        if (!title, !description, !price, !thumbnail, !code, !stock, !category) return res.json({ status: 'error', message: 'Faltan datos en la creación del producto' })
        const createProduct = await productModel.create({
            title,
            description,
            price,
            thumbnail: img || null,
            code,
            stock,
            category
        })

        res.json({ product: createProduct.toObject() })
    }
    catch (error) {
        return res.status(500).json({ status: 'error', message: error.message })
    }
})
export default router;