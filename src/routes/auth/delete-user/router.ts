import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestQuery } from "zod-express-middleware";
import { errorHandler } from "@/middlewares/errorHandler";
import { SDeleteUser } from "@/schemas/deleteUser";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete(
    "/",
    validateRequestQuery(SDeleteUser),
    errorHandler(async (req, res) => {
      const { id } = req.query;
      console.log(req.query);

      const deletedUser = await prisma.user.delete({ where: { id } });

      res.status(200).json({ ...deletedUser });
    })
  );

  return router;
};
