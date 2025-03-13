import express from 'express'
import { Request,Response } from 'express';
import client from '..';
const router=express.Router();
import { authMiddleware } from '../middleware';


export const getMessages=async(req:Request,res:Response)=>{
    let limit=20;
    console.log("entered" ,req.params.receiverId)
    const {receiverId}=req.params;
    const cursor= req.query.cursor 
    try{
        const messages=await client.messages.findMany({
            where:{
                OR:[
                    {
                        senderId:req.userId,
                        receiverId:parseInt(receiverId)
                    },
                    {
                        senderId:parseInt(receiverId),
                        receiverId:req.userId
                    }
                ]
                },
                take:limit,
                cursor: cursor ? { id: parseInt(cursor as string) } : undefined,
                orderBy:{
                    createAt:"desc"
                }
        })
        res.status(200).json({status:true,messsages:messages})
        
    }catch(e){
        console.log(e)
        res.status(500).json({status:false ,message:"internal server error"})
    }

}

router.get('/' ,(req:any,res:any)=>{
    res.json({ user: req.userId ,message:'User is authenticated' })
})
router.get('/getall/:receiverId',authMiddleware,getMessages)

export default router;







