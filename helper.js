 import bcrypt from 'bcryptjs';

 export async function hashassingword(Password){
    const salt =await  bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password,salt);
    return hash;
 }