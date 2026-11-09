import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import sendEmail from './lib/sendEmail.js'

const connection = new Redis("redis://localhost:6379",{
    maxRetriesPerRequest:null
})

const emailQueue =new Worker("emailQueue",async(job)=>{
    console.log("job start");
    
    const email = job.data.email
    await sendEmail(email)
    console.log("job completed");
    
},{connection})

export default emailQueue

