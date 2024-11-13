import express from 'express';
import {  checkuser, products, register } from './mongo.js';
import { hashassingword } from './helper.js';


const router = express.Router();

router.get("/",async(req,res)=>{
    const data=await products();
    res.send(data);
})
router.post("/register",async(req,res)=>{
    try{
    const {Name,Emailid,Password}=req.body;
    const finduser = await checkuser(Emailid);
    console.log(finduser)
    if(!finduser){
        const hasedpass=await hashassingword(Password);
        const newdata={
         Name,
         Emailid,
         hasedpass
        }
         const registerdata= await register(newdata);
         res.status(201).send("regiter successful")
}else{
    
    return  res.status(409).send("Usr already exist");
}
}catch(err){
    console.error(err);
    res.status(500).send("Error occured");
}
})

const userrouter=router
export default userrouter;