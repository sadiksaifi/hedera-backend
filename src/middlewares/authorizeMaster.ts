import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";

export const authorizeMaster = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Authorize Master function");
    next();
  }
);
