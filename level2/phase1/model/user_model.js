import mongoose, { model } from "mongoose";

const userScheme =new mongoose.Schema({
    name:String,
    email:String,
    password:String
}, {timestamps:true})

const User=mongoose.model("user", userScheme)

export default User