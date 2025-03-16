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
const __1 = __importDefault(require(".."));
const router = express_1.default.Router();
router.get('/getall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const users = yield __1.default.user.findMany({
            where: {
                id: { not: userId }
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        res.status(200).json({ message: "success", users });
        return;
    }
    catch (e) {
        console.log(e, " /user get all ");
        res.status(500).json({ message: "internal server error" });
        return;
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield __1.default.user.findFirst({
            where: {
                id: parseInt(id)
            }
        });
        if (!user) {
            res.status(404).json({ message: "user not found" });
            return;
        }
        res.status(200).json({ message: "user found", user });
    }
    catch (e) {
        console.log(e, " /user: id");
        res.status(500).json({ message: "internal server error" });
    }
}));
exports.default = router;
