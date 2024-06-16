import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { errorHandler } from "@/middlewares/errorHandler";
import { SHederaDetails } from "@/schemas/changeHederaAccDetails";

const prisma = new PrismaClient();
export const router: ExpressRouter = async () => {
  const router = Router();

  router.put(
    "/",
    validateRequestBody(SHederaDetails),
    errorHandler(async (req, res) => {
      const { userId } = res.locals;
      if (!userId) throw new Error("You are not authenticated for this");

      const newData = await prisma.user.update({
        where: { id: userId },
        data: { ...req.body },
      });
      console.log(newData);
      res.status(200).json(newData);
    })
  );

  return router;
};
