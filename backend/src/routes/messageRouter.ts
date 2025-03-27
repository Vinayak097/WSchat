import express from 'express'
import { Request,Response } from 'express';
import client from '..';
const router=express.Router();
import { authMiddleware } from '../middleware';

export const getMessages = async (req: Request, res: Response) => {
    const limit = 15; // Default limit for messages
    const { receiverId } = req.params;
    const cursor = req.query.cursor as string | undefined; // Cursor-based pagination
    const direction = (req.query.direction as 'older' | 'newer') || 'newer'; // Default to getting latest messages

    if (!receiverId || isNaN(Number(receiverId))) {
         res.status(400).json({ status: false, message: "Invalid receiverId" });
         return;
    }

    try {
        const messages = await client.messages.findMany({
            where: {
                OR: [
                    { senderId: req.userId, receiverId: Number(receiverId) },
                    { senderId: Number(receiverId), receiverId: req.userId }
                ]
            },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: Number(cursor) } : undefined,
            orderBy: { createAt: 'desc' } 
        });

        
        const orderedMessages = direction === 'newer' ? messages.reverse() : messages;

        res.status(200).json({
            status: true,
            messages: orderedMessages,
            hasMore: messages.length === limit
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
};

router.get('/' ,(req:any,res:any)=>{
    res.json({ user: req.userId ,message:'User is authenticated' })
})
router.get('/getall/:receiverId',authMiddleware,getMessages)

export default router;







