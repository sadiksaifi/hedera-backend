import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authorizeAdmin = errorHandler(
  async (_: Request, res: Response, next: NextFunction) => {
    const { userId, userRole } = res.locals;
    if (!userId || !userRole)
      throw new Error("Unauthorized Acces denied, login to continue");

    if (res.locals.userRole === "MEMBER")
      throw new Error("You should be a MASTER user to perform this action");
    // Master and admin goes past this

    next();
  }
);
