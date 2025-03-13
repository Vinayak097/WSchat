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
    let limit = 20;
    console.log("entered", req.params.receiverId);
    const { receiverId } = req.params;
    const cursor = req.query.cursor;
    try {
        const messages = yield __1.default.messages.findMany({
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
            take: limit,
            cursor: cursor ? { id: parseInt(cursor) } : undefined,
            orderBy: {
                createAt: "desc"
            }
        });
        res.status(200).json({ status: true, messsages: messages });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ status: false, message: "internal server error" });
    }
});
exports.getMessages = getMessages;
router.get('/', (req, res) => {
    res.json({ user: req.userId, message: 'User is authenticated' });
});
router.get('/getall/:receiverId', middleware_1.authMiddleware, exports.getMessages);
exports.default = router;
