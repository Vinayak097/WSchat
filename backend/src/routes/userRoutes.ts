import e from "express";
import { Request,Response } from "express";
import client from "..";

import { generateToken } from "../GenrateToken";
import { createSchema, emailLoginSchema, LoginType, usernameLoginSchema } from "../validations/user";
const router=e.Router();
router.get('/getall' , async(req:Request,res:Response)=>{
    const userId=req.userId;
    try{
        const users=await client.user.findMany({
            where:{
                id:{not:userId}

            },
            select:{
                id:true,
                username:true,
                email:true
            }
        })
        res.status(200).json({message:"success" , users})
        return;
    }catch(e){
        console.log(e," /user get all ")
        res.status(500).json({message:"internal server error"})
        return;
    }
})
router.get("/:id",async(req:Request,res:Response)=>{
    const id=req.params.id;
    try{
        const user=await client.user.findFirst({
            where:{
                id:parseInt(id)
            }
        }    )
    
        if(!user){
            res.status(404).json({message:"user not found"})
            return;
        }
    
        res.status(200).json({message:"user found",user})

    }catch(e){
        console.log(e," /user: id")
        res.status(500).json({message:"internal server error"})
    }  
})



export default router;