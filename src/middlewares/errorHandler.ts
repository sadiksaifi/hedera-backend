import {
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
  ReceiptStatusError,
  StatusError,
} from "@hashgraph/sdk";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  fn: (
    req: Request<any>,
    res: Response<any>,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (
        error instanceof PrismaClientValidationError ||
        error instanceof PrismaClientInitializationError ||
        error instanceof PrismaClientRustPanicError ||
        error instanceof PrismaClientUnknownRequestError ||
        error instanceof PrismaClientKnownRequestError
      ) {
        const messages = error.message.split("\n");
        res
          .status(400)
          .json({ message: messages[messages.length - 1], name: error.name });
      } else if (
        error instanceof StatusError ||
        error instanceof ReceiptStatusError ||
        error instanceof BadKeyError ||
        error instanceof BadMnemonicError ||
        error instanceof PrecheckStatusError
      )
        res.status(400).json({ message: error.message, name: error.name });
      else if (error instanceof Error)
        res.status(400).json({ message: error.message });
      else
        res.status(500).json({
          message: "Something went wrong",
          name: "InternalServerError",
        });
    }
  };
};
