import express from "express"
import proxy from "express-http-proxy"

const app = express()

app.get("/",(req,res)=>{
    return res.status(200).json({message:"hello from gate"})
})

app.use("/auth",proxy("http://localhost:5000"))
app.use("/product",proxy("http://localhost:5001"))
app.use("/order",proxy("http://localhost:5002"))
app.listen(8000,()=>{
    console.log("running");
    
})