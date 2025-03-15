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
const GenrateToken_1 = require("../GenrateToken");
const user_1 = require("../validations/user");
const routes = express_1.default.Router();
routes.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const payload = user_1.createSchema.safeParse(body);
    if (!payload.success) {
        res.status(411).json({ message: payload.error.errors[0].path + payload.error.errors[0].message });
        return;
    }
    const { username, email, password } = payload.data;
    try {
        const existUser = yield __1.default.user.findFirst({
            where: {
                email
            }
        });
        if (existUser) {
            console.log(existUser);
            res.status(400).json({ message: "user aleardy exist with this email please login" });
            return;
        }
        const newUser = yield __1.default.user.create({
            data: { username, password, email }
        });
        const token = (0, GenrateToken_1.generateToken)({ userId: newUser.id, password });
        res.cookie('wstoken', token, {
            httpOnly: true,
            secure: false, // Set to true in production (HTTPS only)
            sameSite: "lax", // Use "none" if frontend and backend are on different domains
        });
        res.status(201).json({ message: "singup successful", user: { id: newUser.id, username: newUser.username, email: newUser.email } });
        return;
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Integernal server error " });
    }
}));
routes.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    const { type, password } = req.body;
    let username, email;
    if (type === user_1.LoginType.EMAIL) {
        payload = user_1.emailLoginSchema.safeParse(req.body);
        email = req.body.email;
    }
    else {
        payload = user_1.usernameLoginSchema.safeParse(req.body);
        username = req.body.username;
    }
    console.log(payload);
    if (!payload.success) {
        res.status(411).json({ message: "validation failed" });
        return;
    }
    try {
        let existUser;
        if (type === user_1.LoginType.USERNAME) {
            existUser = yield __1.default.user.findFirst({
                where: {
                    username
                }
            });
        }
        else {
            existUser = yield __1.default.user.findFirst({
                where: {
                    email
                }
            });
        }
        if (!existUser || existUser.password !== password) {
            res.status(401).json({ message: 'Invalid email/password' });
            return;
        }
        const token = yield (0, GenrateToken_1.generateToken)({ userId: existUser.id, password });
        res.cookie('wstoken', token, {
            httpOnly: true,
            secure: false, // Set to true in production (HTTPS only)
            sameSite: "lax", // Use "none" if frontend and backend are on different domains
        });
        res.status(200).json({ message: 'login success', user: { id: existUser.id, username: existUser.username, email: existUser.email } });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({ message: "return signup" });
    }
}));
exports.default = routes;
