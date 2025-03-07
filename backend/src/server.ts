import e, { Express } from "express";
import WebSocket from "ws";
import jwt, { JwtPayload } from 'jsonwebtoken'
import client from './index'
import { authMiddleware } from "./middleware";
import authRouter from './routes/userRoutes'
import cookieParser from 'cookie-parser'

// Define custom WebSocket interface with userId
interface CustomWebSocket extends WebSocket {
    userId?: number;
}
const users = new Map();
const app = e();
app.use(e.json())
app.use(cookieParser())
app.use('/auth', authRouter)

// Protected route with auth middleware
app.get('/user', authMiddleware, async (req: any, res: any) => {
    res.json({ user: req.userId ,message:'User is authenticated' });
});

const server = app.listen(3000, () => {
    console.log("Server listening on port 3000")
})

const wss = new WebSocket.Server({ server })

wss.on('connection', async (ws: CustomWebSocket, req) => {
    try {
        const cookie = req.headers.cookie;
        if (!cookie) {
            ws.close(1008, 'Unauthorized');
            return;
        }
        
        // Match cookie name with userRoutes.ts
        const token = cookie.split('wstoken=')[1]?.split(';')[0];
        if (!token) {
            ws.close(1008, 'No token found');
            return;
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!payload?.success){
            ws.close(1008, 'Invalid token');
            return;
        }

        ws.userId = payload.userId;
        users.set(payload.userId,ws);
        ws.send(JSON.stringify({ type: 'connection', message: 'Connected to server' }));

        ws.on('message', async (event) => {
            const {message,receiverId}=JSON.parse(event.toString());

            const reciever=users.get(receiverId)
            
            try {
                const newMessage = await client.messages.create({
                    data: {
                        content: message,
                        senderId: ws.userId as number,
                        receiverId
                    }
                });
                if(reciever.readyState===WebSocket.OPEN){

                
                reciever.send(JSON.stringify({
                    type: 'message',
                    data: newMessage
                }));
            }
                
            } catch (e) {
                console.error('Error saving message:', e);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to save message'
                }));
            }
        });
    } catch (e) {
        console.error('WebSocket connection error:', e);
        ws.close(1008, 'Unauthorized');    
    }
});

export default app;



