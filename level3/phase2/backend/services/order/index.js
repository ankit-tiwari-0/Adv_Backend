import express from "express"

const app = express()

app.get("/",(req,res)=>{
    return res.status(200).json({message:"hello from order"})
})
app.listen(5002,()=>{
    console.log("running");
    
})