import { client } from "./index.js";
import { ObjectId } from "mongodb";

export async function products(){
    try{
        return await client.db("E-commerce").collection("exclusive").find().toArray();
    }catch(err){
        console.log("Error occurred",err);
        throw err;
    }
}

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
export async function storestring(Email,hashstring){
    try{
        return await client.db("E-commerce").collection("register").findOneAndUpdate({Email:Email},{$set:{TempData:hashstring}},{returnDocument:"after"});
    }catch(err){
        return err;
    }
}
export async function updatepassword(Email,Newpassword){
    try{
        return await client.db("E-commerce").collection("register").findOneAndUpdate({Email:Email},{$set:{Password:Newpassword}},{returnDocument:"after"});
    }catch(err){
        return err;
    }
}
export async function deletedata(Email){
    try{
        return await client.db("E-commerce").collection("register").findOneAndUpdate({Email:Email},{$unset:{TempData:""}},{returnDocument:"after"})
    }catch(err){
        return err;
    }
}
export async function findproduct(category, id) {
    try {
        const objectid =  ObjectId.createFromHexString(id);
        if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
  
      return await client
        .db("E-commerce")
        .collection(category)
        .findOne({ _id: objectid });
    } catch (err) {
      console.error("Error in findproduct:", err);
      throw err; 
    }
  }
  export async function findprd(category,id){
    try{
        const objectid =  ObjectId.createFromHexString(id);
        if (!ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
        return await client.db("E-commerce").collection(category).findOne({_id:objectid})
    }catch(err){
        return err;
    }
  }
  export async function addingtocart(prd){
    try{
        return await client.db("E-commerce").collection("cart").insertOne(prd)
    }catch(err){
        return err;
    }
  }
  export async function cartproduct(){
    try{
        return  client.db("E-commerce").collection("cart").find().toArray();
    }catch(err){
        return err;
    }
  }
  export async function removefromcart(id){
    try{
        if (!ObjectId.isValid(id)) {
            throw new Error("Invalid ID format");
          }
          const objectid =  ObjectId.createFromHexString(id);
        return await client.db("E-commerce").collection("cart").deleteOne({_id:objectid})
    }catch(err){
        return err;    }
  }