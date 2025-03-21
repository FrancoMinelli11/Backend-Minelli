import { Router } from "express";

const router = Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/createProduct', (req, res) => {
    res.render('createProduct')
})

export default router