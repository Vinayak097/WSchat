import express from 'express'
import { Request,Response } from 'express';
import client from '..';
const router=express.Router();
import { authMiddleware } from '../middleware';

export const getMessages = async(req: Request, res: Response) => {
    let limit = 20;
    
    const { receiverId } = req.params;
    const cursor = req.query.cursor;
    const direction = req.query.direction || 'newer'; // 'older' or 'newer'
    
    try {
        const messages = await client.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: req.userId,
                        receiverId: parseInt(receiverId)
                    },
                    {
                        senderId: parseInt(receiverId),
                        receiverId: req.userId
                    }
                ]
            },
            take: direction === 'older' ? -limit : limit, // Negative for older messages
            skip: cursor ? 1 : 0, // Skip the cursor itself
            cursor: cursor ? { id: parseInt(cursor as string) } : undefined,
            orderBy: {
                createAt: "asc" // Newest first
            }
        });
        
        // If we're fetching older messages, we need to reverse them to maintain chronological order
        const orderedMessages = direction === 'older' ? messages.reverse() : messages;
        
        res.status(200).json({
            status: true,
            messages: orderedMessages,
            hasMore: messages.length === limit
        });
        
    } catch(e) {
        console.log(e);
        res.status(500).json({status: false, message: "internal server error"});
    }
}

router.get('/' ,(req:any,res:any)=>{
    res.json({ user: req.userId ,message:'User is authenticated' })
})
router.get('/getall/:receiverId',authMiddleware,getMessages)

export default router;







