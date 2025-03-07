"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (payload, expiresIn = '24h') => {
    console.log('HELLO THIS IS PROCESS ', process.env.JWT_SECRET);
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    return token;
};
exports.generateToken = generateToken;
