import express from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';
import userrouter from './userrouter.js';
dotenv.config();


const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());

const MONGO=process.env.MONGO_URL;
async function connectmongo(){
    try{
     const client = new MongoClient(MONGO);
    await client.connect();
    console.log("mongodb connected");
    return client;
    }catch(err){
        console.log("Error conncting to the MongoDB",err);
        process.exit(1);
    }
}
export let client = await connectmongo();
app.use("/",userrouter);//completed
app.use("/register",userrouter);
app.use("/login",userrouter);
app.use("/cart",userrouter);
app.use("/clothes",userrouter);
app.use("/electronics",userrouter);
app.use("/appliances",userrouter);
app.use("/toys",userrouter);

app.listen(port,()=>{console.log("server started at the port",port)})
