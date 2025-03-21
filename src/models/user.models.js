import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    name: String,
    last_name:String,
    email: {
        type:String,
        unique: true
    }
})

export const userModel = mongoose.model(userCollection, userSchema)