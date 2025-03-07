"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchema = exports.emailLoginSchema = exports.usernameLoginSchema = exports.LoginType = exports.createSchema = void 0;
const zod_1 = __importStar(require("zod"));
exports.createSchema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
var LoginType;
(function (LoginType) {
    LoginType["EMAIL"] = "email";
    LoginType["USERNAME"] = "username";
})(LoginType || (exports.LoginType = LoginType = {}));
exports.usernameLoginSchema = zod_1.default.object({
    username: zod_1.default.string().min(3, 'Username must be at least 3 characters'),
    password: zod_1.default.string().min(3, 'Password must be at least 6 characters')
});
// Login Schema (Email Based)
exports.emailLoginSchema = zod_1.default.object({
    email: zod_1.default.string().email('Invalid email format'),
    password: zod_1.default.string().min(3, 'Password must be at least 6 characters')
});
exports.messageSchema = zod_1.default.object({
    senderId: (0, zod_1.number)(),
    content: (0, zod_1.string)(),
    createdAt: (0, zod_1.date)()
});
