import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";

export const authorizeMember = errorHandler(
  async (_: Request, res: Response, next: NextFunction) => {
    const { user, session } = res.locals;
    if (!user || !session)
      throw new Error("Unauthorized Acces denied, login to continue");

    next();
  }
);
