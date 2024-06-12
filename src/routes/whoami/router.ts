import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { prismaClient } from "@/lib/auth";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.get(
    "/",
    errorHandler(async (_, res) => {
      if (!res.locals.user) throw new Error("Not Logged In");
      const user = await prismaClient.user.findFirst({
        where: { id: res.locals.user.id },
      });
      res.status(200).json({ ...user, password: undefined });
    })
  );

  return router;
};
