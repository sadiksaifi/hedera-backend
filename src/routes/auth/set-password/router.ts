import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import bcryptjs from "bcryptjs";
import { errorHandler } from "@/middlewares/errorHandler";
import { SNewUserPassword } from "@/schemas/setPassword";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SNewUserPassword),
    errorHandler(async (req, res) => {
      const userId = res.locals.userId; // this is being set by the middleware
      if (!userId) throw new Error("Invalid Token");

      const { password } = req.body;
      const salt = bcryptjs.genSaltSync(10);
      const passwordHash = bcryptjs.hashSync(password, salt);

      const user = await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE", password: passwordHash },
      });

      res.status(200).json({ user });
    })
  );

  return router;
};
