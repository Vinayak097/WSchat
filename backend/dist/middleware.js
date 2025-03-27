"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.wstoken; // Changed from access_token to wstoken
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!(payload === null || payload === void 0 ? void 0 : payload.userId)) {
            res.status(403).json({ message: "Invalid token" });
            return;
        }
        req.userId = payload.userId;
        next(); // ✅ Move to the next middleware
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(403).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
