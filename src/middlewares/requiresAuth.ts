import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const requiresAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = (req.headers.authorization ||
      req.headers.Authorization) as string;
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.status(401);
    res.json("Access denied, invalid token");
    return res.status(401).json("Access denied, invalid token");
  }
};

export default requiresAuth;
