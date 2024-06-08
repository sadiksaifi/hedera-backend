import { NextFunction, Request, Response } from "express";

export const authorizeMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies;
    console.log(cookie);
  } catch (error) {}
};
