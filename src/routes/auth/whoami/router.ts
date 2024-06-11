import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { prismaClient } from "@/lib/auth";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.get(
    "/",
    errorHandler(async (req, res) => {
      if (res.locals.userId && res.locals.userRole) {
        const user = await prismaClient.user.findFirst({
          where: { id: res.locals.userId },
        });
        res.status(200).json({ ...user });
        return;
      }
      res
        .status(200)
        .json({ id: res.locals.userId, role: res.locals.userRole });
    })
  );

  return router;
};
