import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
 * Auth Routes
  "/auth/login"
  "/auth/set-password"
  
 * Master Routes
  "/create-user",
  "/delete-user",

 * Private Routes
  "/whoami",
  "/logout",
  "/users",
  "/users/change-role",
  "/coin/create",
  "/coin/wipe",
  "/coin/cashin",
  "/coin/get-info",
  "/coin/burn",
  "/coin/get-balances",
  "/coin/pause",
  "/coin/unpause",
  "/treasury",
  "/coin/associate",
  "/coin/transfer",
  "/coin/freeze",
  "/coin/unfreeze",
  "/coin/delete",
  "/role/update",
*/

export const authorize = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, session } = res.locals;
    const url = req.url;

    if (url.startsWith("/api/auth")) return next();
    else if (!user || !session)
      throw new Error("Unauthorized Acces denied, login to continue");

    if (user.role === "MASTER") return next();
    else if (url.startsWith("/master"))
      throw new Error("Not Authorized for this functionality");

    next();
  }
);
