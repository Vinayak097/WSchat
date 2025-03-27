import e from "express";
import WebSocket from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import client from './index'
import { authMiddleware } from "./middleware";
import authRouter from './routes/authRoutes'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes'
import messageRouter from './routes/messageRouter'
// Define custom WebSocket interface with userId
interface CustomWebSocket extends WebSocket {
    userId?: number;
}
const users = new Map();
const app = e();
app.use(e.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use('/auth', authRouter)
app.use('/user', authMiddleware, userRouter);
// Protected route with auth middleware
app.get('/user', authMiddleware, async (req: any, res: any) => {
    res.json({ user: req.userId ,message:'User is authenticated' });
});

app.use('/message',authMiddleware,messageRouter)

const server = app.listen(3000, () => {
    console.log("Server listening on port 3000")
})

const wss = new WebSocket.Server({ server })

wss.on('connection', async (ws: CustomWebSocket, req) => {
    try {
        
       
        ws.send(JSON.stringify({ type: 'connection', message: 'Connected to server' }));

        ws.on('message', async (event) => {          
            const data=JSON.parse(event.toString());
            if(data.type==='authenticate'){
                const token=data.token 
                try{
                    const payload = jwt.verify(token, process.env.JWT_ws_SECRET as string) as JwtPayload;
                    
                    if(payload.userId){
                       
                        ws.userId = payload.userId;
                        users.set(payload.userId,ws);
                        ws.send(JSON.stringify({ type: 'authenticate', message: 'Authenticated' }));
                    }else{
                       
                        ws.close(1008, 'Invalid token');
                        return;
                    }          
                }            catch(e){
                    console.log(e)
                    ws.close(1008, 'Invalid token');
                    return;
                }
                
                      
            }
         
            try {
                if(data.type==='message'){
                    const {message,receiverId}=data;
                    const reciever=users.get(receiverId)
                    console.log(" recievr id and mesage onole " , receiverId,message)
                    if (!ws.userId) {
                        ws.send(JSON.stringify({ type: 'error', message: 'You are not authenticated' }));
                        return;
                    }
                const newMessage = await client.messages.create({
                    data: {
                        content: message,
                        senderId: ws?.userId as number,
                        receiverId
                    }
                });
                console.log("new message",newMessage)
                
                if(reciever && reciever.readyState===WebSocket.OPEN){

                
                reciever.send(JSON.stringify({
                    type: 'message',
                    data: newMessage
                }));
            }
            if(ws){
                ws.send(JSON.stringify({
                    type:'message',
                    data:newMessage
                }))
            }
        }
            } catch (e) {
                console.error('Error saving message:', e);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to save message'
                }));
            }   
        });
        ws.on('close',()=>{
            users.delete(ws.userId)
    })
    } catch (e) {
        console.error('WebSocket connection error:', e);
        ws.close(1008, 'Unauthorized');    
    }
});

export default app;



