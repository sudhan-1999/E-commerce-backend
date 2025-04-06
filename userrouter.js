import express from "express";
import {
  addingtocart,
  cartproduct,
  checkuser,
  datas,
  deletedata,
  findprd,
  findproduct,
  products,
  register,
  removefromcart,
  storestring,
  updatepassword,
  appliances,
  getclothes,
  getelectronics,
  toys
} from "./mongo.js";
import { comparepass, compringcode, generatestring, hashassingword } from "./helper.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await products();
  res.send(data);
});
router.post("/register", async (req, res) => {
  try {
    const { Name, Email, Password } = req.body;
    const finduser = await checkuser(Email);
    if (!finduser) {
      const hasedpass = await hashassingword(Password);
      const newdata = {
        Name,
        Email,
        hasedpass,
      };
      await register(newdata);
      res.status(201).send("regiter successful");
    } else {
      return res.status(409).send("Usr already exist");
    }
  } catch (err) {
    res.status(500).send("Error occured");
  }
});
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await checkuser(Email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User  Not Exist",
      });
    }
    const comparing = await comparepass(user, Password);
    if (user.Email == Email && comparing) {
      return res.status(200).json({
        success: true,
        message: "Login Sucessful",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Wrong Credentials",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occured");
  }
});
router.post("/forgotpassword", async (req, res) => {
  try {
    const Email = req.body.Email;
    const findemail = await checkuser(Email);
    if (findemail) {
      const string = crypto.randomBytes(5).toString("hex").slice(0, 4);
      const hashstring = await generatestring(string);
      await storestring(Email, hashstring);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });
      var mailoption = {
        from: process.env.email,
        to: `${Email}`,
        subject: "Code to reset password",
        text: `Enter the code to reset your password:${string}`,
      };
      transporter.sendMail(mailoption, function (error, info) {
        if (error) {
          res.status(500).json(error);
        } else {
          res.status(200).json(info);
        }
      });
    } else {
      res.status(200).json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});
router.post("/resetpassword",async (req,res)=>{
    const {Email,code,password}=req.body;
    try{
        const findemail=await checkuser(Email);
       const compare= await compringcode(findemail,code);
       if(compare){
        const Newpassword=await hashassingword(password);
        await updatepassword(Email,Newpassword);
        await deletedata(Email);
        res.status(200).json({sucees:"true",
            message:"updated successfully"})
       }
    }catch(err){
        res.status(500).send(`Error occured:${err}`);
    }
})

/*router.get("/clothes", async (req, res) => {
  try {
    const cloth = await getclothes();
    res.status(200).json(cloth);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/electronics", async (req, res) => {
  try {
    const electronics = await getelectronics();
    res.status(200).json(electronics);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/appliances", async (req, res) => {
  try {
    const appliance = await appliances();
    res.status(200).json(appliance);
  } catch (err) {
    res.status(500).json(err);
  }
});*/

router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const data = await datas(category);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/:category/:id",async(req,res)=>{
  try{
  const{category,id}=req.params;
  const prd=await findproduct(category,id);
  if (!prd) {
    return res.status(404).json({ error: "Product not found in the specified category" });
  }
  res.status(200).json(prd)
}catch(err){
  res.status(500).json({error:`Error occured:${err}`})
}
})
router.post("/cart/:category/:id",async(req,res)=>{
  try{ const {category,id}=req.params;
   const prd=await findprd(category,id);
   if (!prd) {
    return res.status(404).json({ error: "Product not found in the specified category" });
  }
   await addingtocart(prd);
   res.status(200).send({ message: "Added to cart successfully" });
  }catch(err){
    res.status(500).send({ error: "Failed to add to cart" });
  }
 
})
router.get("/cart",async(req,res)=>{
  try{
    const product=await cartproduct();
    res.status(200).send(product);
  }catch(err){
    res.status(500).send({"messag":err});
  }
})
router.delete("/cart/:id",async(req,res)=>{
  try{
    const {id}=req.params;
    const cartproduct=await removefromcart(id)
    if (cartproduct.deletedCount === 1) {
      res.status(200).send({ message: "Product removed from cart" });
    } else {
      res.status(404).send({ message: "Product not found in cart" });
  }
  }catch(err){
    res.status(500).send({"message":err})
  }
})

const userrouter = router;
export default userrouter;
