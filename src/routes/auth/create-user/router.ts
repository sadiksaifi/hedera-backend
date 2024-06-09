import { SAuthUser } from "@/schemas/auth";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import bcryptjs from "bcryptjs";
import { errorHandler } from "@/middlewares/errorHandler";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SAuthUser),
    errorHandler(async (req, res) => {
      const { email, password } = req.body;

      const salt = bcryptjs.genSaltSync(10);
      const passwordHash = bcryptjs.hashSync(password, salt);

      const user = await prisma.user.create({
        data: { email, password: passwordHash, role: "MEMBER" },
      });

      res.status(200).json({ ...user });
    })
  );

  return router;
};
