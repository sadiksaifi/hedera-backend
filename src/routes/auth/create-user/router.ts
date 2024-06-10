import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { errorHandler } from "@/middlewares/errorHandler";
import { SNewUser } from "@/schemas/newUser";
import { sendMail } from "@/lib/sendMail";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SNewUser),
    errorHandler(async (req, res) => {
      const { name, email, hederaAccId, hederaPubKey } = req.body;
      const user = await prisma.user.create({
        data: {
          name,
          hederaAccId,
          hederaPubKey,
          email,
          role: "MEMBER",
          status: "PENDING",
        },
      });

      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "jwt_key", {
        expiresIn: "1w",
      });

      const emailTemplate = `<strong>Visit the following link to verify your account creation</strong><p>${process.env.FRONTEND_DOMAIN}/auth/set-password?token=${token}</p><p>This link is valid for 7 days only</p>`;
      const mail = await sendMail(email, emailTemplate);

      res.status(200).json({ user, email: mail });
    })
  );

  return router;
};
