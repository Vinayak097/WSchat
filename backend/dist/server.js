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
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/auth', userRoutes_1.default);
// Protected route with auth middleware
app.get('/user', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ user: req.userId });
}));
const server = app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cookie = req.headers.cookie;
        if (!cookie) {
            ws.close(1008, 'Unauthorized');
            return;
        }
        // Match cookie name with userRoutes.ts
        const token = (_a = cookie.split('wstoken=')[1]) === null || _a === void 0 ? void 0 : _a.split(';')[0];
        if (!token) {
            ws.close(1008, 'No token found');
            return;
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            ws.close(1008, 'Invalid token');
            return;
        }
        ws.userId = payload.userId;
        ws.send(JSON.stringify({ type: 'connection', message: 'Connected to server' }));
        ws.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
            const msg = message.toString();
            try {
                const newMessage = yield index_1.default.messages.create({
                    data: {
                        content: msg,
                        senderId: ws.userId
                    }
                });
                wss.clients.forEach((client) => {
                    if (client.readyState === ws_1.default.OPEN) {
                        client.send(JSON.stringify({
                            type: 'message',
                            data: newMessage
                        }));
                    }
                });
            }
            catch (e) {
                console.error('Error saving message:', e);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Failed to save message'
                }));
            }
        }));
    }
    catch (e) {
        console.error('WebSocket connection error:', e);
        ws.close(1008, 'Unauthorized');
    }
}));
exports.default = app;
