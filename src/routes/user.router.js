import { Router } from "express";
import { userModel } from "../models/user.models.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find()
        res.json({status:'success', payload: users})
    } catch (error) {
        res.status(500).json({status:'error', message:error.message})
    }
})

router.post('/', async (req, res) => {
    try {
        const {name,last_name,email} = req.body
        if(!name || !last_name || !email) return res.json({status:'error', message:'Faltan datos en la solicitud'})
        const createUsers = await userModel.create({
            name,
            last_name,
            email
        })
        res.json({status:'success', message:createUsers})
    } catch (error) {
        res.status(500).jsonp({status:'error', message:error.message})
    }
})


export default router