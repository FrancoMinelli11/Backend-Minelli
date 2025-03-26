import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                    required:true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        required:true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
})

cartSchema.pre(/^find/, function(next) {
    this.populate('products.product')
    next()
})

export const cartModel = mongoose.model('carts', cartSchema)
