import express from "express"


const app = express()


app.get("/", (req,res)=>{
    return res.status(200).json({message:"okkkkkkkkkkkk"})
})

app.listen(5000,()=>{
    console.log("server is running on 5000");
    
})

export default 5000;
