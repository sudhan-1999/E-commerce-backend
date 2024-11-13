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
        return await client.db("E-commerce").collection("register").insertOne({Name:newdata.Name,Email:newdata.Emailid,Password:newdata.hasedpass})
    }catch(err){
        console.log("Error occured",err);
        return err;
    }
}
export async function checkuser(Emailid){
    try{
        return await client.db("E-commerce").collection("register").findOne({Email:Emailid})
    }catch(err){
        return err;
    }
}
