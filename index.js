import express from 'express';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import userrouter from './userrouter.js';
import * as dotenv from 'dotenv';
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
app.use("/register",userrouter);//completed
app.use("/login",userrouter);//completed
app.use("/forgotpassword",userrouter)//completed
app.use("/resetpassword",userrouter)//completed
app.use("/cart",userrouter);
app.use("/clothes",userrouter);//completed
app.use("/electronics",userrouter);//completed
app.use("/appliances",userrouter);//completed
app.use("/toys",userrouter);//completed
app.use("/:category/:id",userrouter)
app.use("/cart/:category/:id",userrouter)
app.use("/cart/:id",userrouter)



app.listen(port,()=>{console.log("server started at the port",port)})
