
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import { Annotation, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";



dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

//without langchain
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


//###############################################################################
//with langchine





// const llm = new ChatGroq({
//     model: "openai/gpt-oss-120b",
//     temperature: 0,
//     maxTokens: 100
// })

// app.post("/lang", async (req, res) => {
//     const { input } = req.body

//     const response = await llm.invoke([
//         {
//             role: "system",
//             content: "You are Bolu, a helpful AI assistant. Always provide accurate, clear, and simple answers. If you don't know something, admit it instead of guessing or providing incorrect information. Never make up facts. Prioritize honesty and accuracy."
//         },
//         {
//             role: "human",
//             content: input

//         }
//     ])


//     return res.status(200).json({ "ai": response.content })
// })



//langGraph
/*const State = Annotation.Root({
    prompt: Annotation,
    aiMsg: Annotation
}) we dont use this because there is built in called-msgannotation
*/
 

const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});

const tools=[tool]
const toolNode=new ToolNode(tools)

const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: 156
}).bindTools(tools)


const callLMM = async (state) => {
    console.log("state:", state);

    const response = await llm.invoke([
        {
            role: "system",
            content: "You are Bolu, a helpful and intelligent AI assistant. Always provide accurate and clear answers. If you don't know the answer, use a relevant tool such as Tavily Search to find reliable information. Never guess or invent facts. Explain things simply and prioritize honesty and accuracy."
        },
       ...state.messages
       ])

    return { messages:[response] }
}

const shouldcontinue=async (state) => {
    const lastMessage=state.messages[state.messages.length-1]   //array[array.length - 1] calculates the last index and then uses that index to retrieve the actual value.
    if (lastMessage.tool_calls.length>0) {
        return "tools"
    }else{
        return "__end__"
    }
}

const graph = new StateGraph(MessagesAnnotation)
    .addNode("agent", callLMM)
    .addNode("tools",toolNode)
    .addEdge("__start__","agent")
    .addEdge("tools","agent")
    .addConditionalEdges("agent",shouldcontinue)
    .compile()


app.post("/graph",async(req,res)=>{
    const {input}=req.body

    const response=await graph.invoke({messages:[
        {
            role:"user",
            content:input
        }
    ]})
    console.log(response);

    return res.status(200).json({"ai:": response.messages[response.messages.length-1].content })
    
})





app.get("/", (req, res) => {
    return res.json({ message: "helooo from lang" })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
