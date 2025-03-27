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
exports.getMessages = void 0;
const express_1 = __importDefault(require("express"));
const __1 = __importDefault(require(".."));
const router = express_1.default.Router();
const middleware_1 = require("../middleware");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = 15; // Default limit for messages
    const { receiverId } = req.params;
    const cursor = req.query.cursor; // Cursor-based pagination
    const direction = req.query.direction || 'newer'; // Default to getting latest messages
    if (!receiverId || isNaN(Number(receiverId))) {
        res.status(400).json({ status: false, message: "Invalid receiverId" });
        return;
    }
    try {
        const messages = yield __1.default.messages.findMany({
            where: {
                OR: [
                    { senderId: req.userId, receiverId: Number(receiverId) },
                    { senderId: Number(receiverId), receiverId: req.userId }
                ]
            },
            take: limit,
            skip: cursor ? 1 : 0, // Skip the cursor message itself
            cursor: cursor ? { id: Number(cursor) } : undefined,
            orderBy: { createAt: 'desc' } // Get latest messages first
        });
        // Reverse only if fetching newer messages to maintain bottom-up order in chat UI
        const orderedMessages = direction === 'newer' ? messages.reverse() : messages;
        res.status(200).json({
            status: true,
            messages: orderedMessages,
            hasMore: messages.length === limit
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ status: false, message: "Internal server error" });
    }
});
exports.getMessages = getMessages;
router.get('/', (req, res) => {
    res.json({ user: req.userId, message: 'User is authenticated' });
});
router.get('/getall/:receiverId', middleware_1.authMiddleware, exports.getMessages);
exports.default = router;
