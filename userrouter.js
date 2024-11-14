import express from 'express';
import {  checkuser, getclothes, getelectronics, products, register } from './mongo.js';
import {  comparepass, hashassingword } from './helper.js';


const router = express.Router();

router.get("/",async(req,res)=>{
    const data=await products();
    res.send(data);
})
router.post("/register",async(req,res)=>{
    try{
    const {Name,Email,Password}=req.body;
    const finduser = await checkuser(Email);
    console.log(finduser)
    if(!finduser){
        const hasedpass=await hashassingword(Password);
        const newdata={
         Name,
         Email,
         hasedpass
        }
         await register(newdata);
         res.status(201).send("regiter successful")
}else{
    
    return  res.status(409).send("Usr already exist");
}
}catch(err){
    console.error(err);
    res.status(500).send("Error occured");
}
})
router.post("/login",async(req,res)=>{
    const{Email,Password}=req.body;
    try{
        const user=await checkuser(Email);
        console.log(user)
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User  Not Exist"
            });
        }
            const comparing=await comparepass(user,Password);
            if(user.Email==Email&&comparing){
                return res.status(200).json({
                    success:true,
                    message:"Login Sucessful"
                })
            }else{
                res.status(401).json({
                    success:false,
                    message:"Wrong Credentials"
                })
            }
    }catch(err){
        console.error(err);
        res.status(500).send("Error occured");
    }
})
router.get("/clothes",async(req,res)=>{
    try{
        const cloth=await getclothes();
        res.status(200).json(cloth);
    }catch(err){
        res.status(500).json(err);
    }
})
router.get("/electronics",async(req,res)=>{
    try{
        const electronics=await getelectronics();
        res.status(200).json(electronics);
    }catch(err){
        res.status(500).json(err);
    }
})

const userrouter=router
export default userrouter;