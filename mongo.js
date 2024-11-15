import { client } from "./index.js";


export async function products(){
    try{
        return await client.db("E-commerce").collection("exclusive").find().toArray();
    }catch(err){
        console.log("Error occurred",err);
        throw err;
    }
}

//E-commerce register toys login exclusive electronics clothes cart appliances
export async function register(newdata){
    try{
        return await client.db("E-commerce").collection("register").insertOne({Name:newdata.Name,Email:newdata.Email,Password:newdata.hasedpass})
    }catch(err){
        console.log("Error occured",err);
        return err;
    }
}
export async function checkuser(Email){
    try{
        return await client.db("E-commerce").collection("register").findOne({Email:Email})
    }catch(err){
        return err;
    }
}
export async function getclothes(){
    try{
        return await client.db("E-commerce").collection("clothes").find().toArray();
    }catch(err){
        return err;
    }
    
}
export async function getelectronics(){
    try{
        return await client.db("E-commerce").collection("electronics").find().toArray();
    }catch(err){
        return err;
    }
    
}
export async function appliances(){
    try{
        return await client.db("E-commerce").collection("appliances").find().toArray();
    }catch(err){
        return err;
    }
    
}
export async function toys(){
    try{
        return await client.db("E-commerce").collection("toys").find().toArray();
    }catch(err){
        return err;
    }
    
}