import { NextFunction, Request, Response } from "express";

declare module 'express-serve-static-core' {
  interface Request {
    userId?: number;
  }
}
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.wstoken; // Assuming the token is stored in a cookie named 'jwt'
    
    if (!token) {
       res.status(401).json({ message: "No token provided" });
    }

    const payload = await jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    if (!payload) {
       res.status(403).json({ message: "Invalid token" });
    }

   
    req.userId = payload.userId;
    next();
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
       res.status(403).json({ message: "Invalid token" });
    }
     res.status(500).json({ message: "Internal server error" });
  }
};