import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.wstoken; // Changed from access_token to wstoken
    
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    if (!payload?.userId) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    req.userId = payload.userId;
    next(); // ✅ Move to the next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(403).json({ message: "Invalid token" });
  }
};
