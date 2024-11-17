 import bcrypt from 'bcryptjs';


 export async function hashassingword(Password){
    const salt =await  bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password,salt);
    return hash;
 }
 export async function comparepass(user,Password){
   const comparing= await bcrypt.compare(Password,user.Password);
   return comparing;
 }
 export async function generatestring(string){
  try{
    const salting=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(string,salting);
    return hash;
  }catch(err){
    return err;
  }
 }
 export async function compringcode(findemail,code){
  try{
    const comparing= await bcrypt.compare(code,findemail.TempData);
    return comparing;
  }catch(err){
    return err;
  }
 }