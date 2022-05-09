"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requiresAuth = async (req, res, next) => {
    try {
        const authorizationHeader = (req.headers.authorization ||
            req.headers.Authorization);
        const token = authorizationHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return res.status(401).json("Access denied, invalid token");
    }
};
exports.default = requiresAuth;
