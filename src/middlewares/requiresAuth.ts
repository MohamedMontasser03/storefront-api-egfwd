import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const requiresAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = (req.headers.authorization ||
      req.headers.Authorization ||
      "") as string;
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    res.locals.userId = (jwt.decode(token) as jwt.JwtPayload)?.user.id;
    next();
  } catch (err) {
    return res.status(401).json("Access denied, invalid token");
  }
};

export default requiresAuth;
