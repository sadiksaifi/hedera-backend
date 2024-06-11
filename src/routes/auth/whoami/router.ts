import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { prismaClient } from "@/lib/auth";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.get(
    "/",
    errorHandler(async (_, res) => {
      if (!res.locals.userId || !res.locals.userRole)
        throw new Error("Not Logged In");
      const user = await prismaClient.user.findFirst({
        where: { id: res.locals.userId },
      });
      res.status(200).json({ ...user, password: undefined });
    })
  );

  return router;
};
