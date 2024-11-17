import express from "express";
import {
  appliances,
  checkuser,
  deletedata,
  getclothes,
  getelectronics,
  products,
  register,
  storestring,
  toys,
  updatepassword,
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
    console.error(err);
    res.status(500).send("Error occured");
  }
});
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await checkuser(Email);
    console.log(user);
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
router.get("/clothes", async (req, res) => {
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
});
router.get("/toys", async (req, res) => {
  try {
    const toy = await toys();
    console.log(toy);
    res.status(200).json(toy);
  } catch (err) {
    res.status(500).json(err);
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
    console.log(err);
    res.status(500).json(err.message);
  }
});
router.post("/resetpassword",async (req,res)=>{
    const {Email,code,password}=req.body;
    console.log(Email,code,password);
    try{
        const findemail=await checkuser(Email);
       const compare= await compringcode(findemail,code);
       if(compare){
        const Newpassword=await hashassingword(password);
        const update=await updatepassword(Email,Newpassword);
        await deletedata(Email);
        console.log(update);
        res.status(200).json({sucees:"true",
            message:"updated successfully"})
       }
    }catch(err){
        res.status(500).send(`Error occured:${err}`);
    }
})

const userrouter = router;
export default userrouter;
