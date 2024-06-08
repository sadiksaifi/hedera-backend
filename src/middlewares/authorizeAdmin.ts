import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const authorizeAdmin = errorHandler(
  async (_: Request, res: Response, next: NextFunction) => {
    const { user, session } = res.locals;
    if (!user || !session)
      throw new Error("Unauthorized Acces denied, login to continue");
    const { id } = session;

    const sessionData = await prisma.session.findFirst({
      where: { id },
      select: { user: true },
    });

    if (sessionData?.user.role === "MEMBER")
      throw new Error("You should be a MASTER user to perform this action");
    // Master and admin goes past this

    next();
  }
);
