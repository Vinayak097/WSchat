const jwt = require("jsonwebtoken");
import dotenv from 'dotenv'
dotenv.config();
 export const generateToken=(payload:{userId:number,password:string},expiresIn='24h')=>{
        
        const token =jwt.sign(payload,process.env.JWT_SECRET,{expiresIn})
        return token;        
}

export const wsgenerateToken=(payload:{userId:number},expiresIn='3h')=>{
        const token =jwt.sign(payload,process.env.JWT_ws_SECRET,{expiresIn})
        return token;
}