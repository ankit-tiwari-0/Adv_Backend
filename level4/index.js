
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"


dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

//without langchain

// Gemini API configuration
// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY
// });

// AI route
// app.post("/ai", async (req, res) => {
//     try {
//         const { message } = req.body;

//         if (!message) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide a message"
//             });
//         }

//         const response = await ai.models.generateContent({
//             model: "gemini-3.5-flash-lite",

//             config: {
//                 systemInstruction: "You are an assistant and your name is Lodu."
//             },

//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: message }]
//                 }
//             ]
//         }); 

//         res.status(200).json({
//             success: true,
//             response: response.text
//         });

//     } catch (error) {
//         console.error("Gemini Error:", error);

//         res.status(error.status || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });

// Start server

//with langchine

const llm = new ChatGroq({
   model: "openai/gpt-oss-120b",
   temperature:0,
   maxTokens:100
})


app.post("/lang", async (req,res) => {
    const {input} = req.body

    const response = await llm.invoke([
        {role:"system", 
            content:"You are Bolu, a helpful AI assistant. Always provide accurate, clear, and simple answers. If you don't know something, admit it instead of guessing or providing incorrect information. Never make up facts. Prioritize honesty and accuracy."},
        {
            role:"human",
            content:input

        }
    ])


    return res.status(200).json({"ai":response.content})
})


app.get("/",(req,res)=> {
    return res.json({message:"helooo from lang"})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

