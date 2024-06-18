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

export const errorHandler = <ReqBody, ReqQuery>(
  fn: (
    req: Request<any, any, ReqBody, ReqQuery>,
    res: Response<any>,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (
    req: Request<any, any, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.log(error);
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
      ) {
        const messages = error.message.split(" ");
        res.status(400).json({
          message: `An error has occurred: ${messages[messages.length - 1]
            .split("_")
            .join(" ")}`,
          name: error.name,
        });
      } else if (error instanceof Error)
        res.status(400).json({ message: error.message });
      else
        res.status(500).json({
          message: "Something went wrong",
          name: "InternalServerError",
        });
    }
  };
};
