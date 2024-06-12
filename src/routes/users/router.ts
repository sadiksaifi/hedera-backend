import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { prismaClient } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();
  router.get(
    "/",
    errorHandler(async (_, res) => {
      const users = await prisma.user.findMany({
        include: { permissions: true },
      });
      res.status(200).json(users);
    })
  );

  return router;
};
