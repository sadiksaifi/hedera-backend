import { lucia } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from "./errorHandler";

export const getSession = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = lucia.readBearerToken(authorization ?? "");
    if (!token) {
      res.locals.userRole = null;
      res.locals.userId = null;
      return next();
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || "jwt_key");
    if (typeof payload === "string")
      throw new Error("Something wrong with jwt format, in getSession");

    res.locals.userId = payload.userId;
    res.locals.userRole = payload.role;
    next();
  }
);
