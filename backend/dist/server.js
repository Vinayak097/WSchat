"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("./index"));
const middleware_1 = require("./middleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const messageRouter_1 = __importDefault(require("./routes/messageRouter"));
const users = new Map();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use('/auth', authRoutes_1.default);
app.use('/user', middleware_1.authMiddleware, userRoutes_1.default);
// Protected route with auth middleware
app.get('/user', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ user: req.userId, message: 'User is authenticated' });
}));
app.use('/message', middleware_1.authMiddleware, messageRouter_1.default);
const server = app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ws.send(JSON.stringify({ type: 'connection', message: 'Connected to server' }));
        ws.on('message', (event) => __awaiter(void 0, void 0, void 0, function* () {
            const data = JSON.parse(event.toString());
            if (data.type === 'authenticate') {
                const token = data.token;
                try {
                    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_ws_SECRET);
                    if (payload.userId) {
                        ws.userId = payload.userId;
                        users.set(payload.userId, ws);
                        ws.send(JSON.stringify({ type: 'authenticate', message: 'Authenticated' }));
                    }
                    else {
                        ws.close(1008, 'Invalid token');
                        return;
                    }
                }
                catch (e) {
                    console.log(e);
                    ws.close(1008, 'Invalid token');
                    return;
                }
            }
            try {
                if (data.type === 'message') {
                    const { message, receiverId } = data;
                    const reciever = users.get(receiverId);
                    console.log(" recievr id and mesage onole ", receiverId, message);
                    if (!ws.userId) {
                        ws.send(JSON.stringify({ type: 'error', message: 'You are not authenticated' }));
                        return;
                    }
                    const newMessage = yield index_1.default.messages.create({
                        data: {
                            content: message,
                            senderId: ws === null || ws === void 0 ? void 0 : ws.userId,
                            receiverId
                        }
                    });
                    console.log("new message", newMessage);
                    if (reciever && reciever.readyState === ws_1.default.OPEN) {
                        reciever.send(JSON.stringify({
                            type: 'message',
                            data: newMessage
                        }));
                    }
                    if (ws) {
                        ws.send(JSON.stringify({
                            type: 'message',
                            data: newMessage
                        }));
                    }
                }
            }
            catch (e) {
                console.error('Error saving message:', e);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to save message'
                }));
            }
        }));
        ws.on('close', () => {
            users.delete(ws.userId);
        });
    }
    catch (e) {
        console.error('WebSocket connection error:', e);
        ws.close(1008, 'Unauthorized');
    }
}));
exports.default = app;
