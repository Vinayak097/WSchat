import e from "express";
import { Request,Response } from "express";
import client from "..";

import { generateToken, wsgenerateToken } from "../GenrateToken";
import { createSchema, emailLoginSchema, LoginType, usernameLoginSchema } from "../validations/user";
import { authMiddleware } from "../middleware";
const routes=e.Router();

routes.post('/signup',async(req:Request,res:Response)=>{
    const body =req.body;
    const payload=createSchema.safeParse( body);    
    if(!payload.success){
        
         res.status(411).json({message: payload.error.errors[0].path +payload.error.errors[0].message})
         return;
    }
    const {username,email,password}=payload.data;
    try{
        const existUser=await client.user.findFirst({
            where:{
                email
            }
        })

        if(existUser){
            
            res.status(400).json({message:"user aleardy exist with this email please login"})
            return;
        }

        const newUser= await client.user.create({
            data:{username,password,email}
        })
        const token=generateToken({userId:newUser.id,password})
        res.cookie('wstoken', token, {
            httpOnly: true,
            secure: false, // Set to true in production (HTTPS only)
            sameSite: "lax", // Use "none" if frontend and backend are on different domains
        });
        const wsConnectiontoken=wsgenerateToken({userId:newUser.id})
        res.status(201).json({message:"singup successful" , user:{id:newUser.id,username:newUser.username , email:newUser.email},wsConnectiontoken})
        return

    }catch(e){
        console.log(e)
        res.status(500).json({message:"Integernal server error "});
    }
    })

    routes.post('/signin',async(req:Request,res:Response)=>{
        let payload;
    const {type,password}=req.body;
    let username,email;
        if(type===LoginType.EMAIL){
            payload=emailLoginSchema.safeParse(req.body);    
            email=req.body.email;

        }else{
            payload=usernameLoginSchema.safeParse(req.body);
            username=req.body.username;
        }

        
        
        if(!payload.success){
            res.status(411).json({message:"validation failed"})
            return
        }
        
        try{
            let existUser:any;
            if(type===LoginType.USERNAME){
                existUser=await client.user.findFirst({
                    where :{
                        username
                    }
                })
            }else{
                existUser= await client.user.findFirst({
                    where:{
                        email
                    }
                })
            }
            if (!existUser || existUser.password !== password) {
                res.status(401).json({ message: 'Invalid email/password' })
                return;
            }
            
            const token=await generateToken({userId:existUser.id,password})
            const wsConnectiontoken=await wsgenerateToken({userId:existUser.id})
            res.cookie('wstoken', token, {
                httpOnly: true,
                secure: false, // Set to true in production (HTTPS only)
                sameSite: "lax", // Use "none" if frontend and backend are on different domains
            });
            res.status(200).json({message:'login success',user:{id:existUser.id,username:existUser.username , email:existUser.email },wsConnectiontoken})

        }catch(e){
            console.log(e)
            res.status(200).json({message:"return signup"})
        }
    })

    routes.get('/autoLogin' ,authMiddleware, async (req:Request,res:Response)=>{
        try{
            if(!req.userId){
                res.status(400).json({message:"user not found"})
                return;
            }
            const user =await client.user.findFirst({
                where:{
                    id:req.userId
                }
            })
            const wsConnectiontoken=await wsgenerateToken({userId:req.userId})
            res.status(200).json({message:"user found",user,wsConnectiontoken})
            return;
        }catch(e){
            console.log(e , " error in auto login") 
            res.status(500).json({message:"internal server error"})
            return;
        }
    })
    export default routes;