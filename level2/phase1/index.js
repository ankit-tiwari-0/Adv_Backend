import express, { json } from 'express'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import User from './model/user_model.js'

dotenv.config()

const app = express()
app.use(express.json())
const port = process.env.PORT

app.get("/", (req,res)=>{
    return res.status(200).json({message:"helle from redis"})
})

app.post("/create",async(req,res)=>{

    const {name,email,password}=req.body;
    const user=await User.create({
     name,email,password
    })

    return res.json(user)
})

app.post("/get",async(req,res)=>{

    const user=await User.find({})

    return res.json(user)
})

app.listen(port,()=>{
    connectDB()
    console.log(`sever is runing on ${port}`);
    
})