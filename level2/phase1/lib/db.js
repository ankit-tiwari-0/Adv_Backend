import mongoose from "mongoose"

const connectDB =async () => {
    try {
       await mongoose.connect(process.env.MONGOOSE)
       console.log("db is connected baby");
       
    } catch (error) {
            res.status(500).json({message: error.message})
            console.log(error);
            
    }
}

export default connectDB