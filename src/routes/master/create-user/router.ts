import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { errorHandler } from "@/middlewares/errorHandler";
import { SNewUser } from "@/schemas/newUser";
import { sendMail } from "@/lib/sendMail";
import jwt from "jsonwebtoken";
import fs from "fs";
import { cwd } from "process";
import { createAccount } from "@/lib/hedera";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SNewUser),
    errorHandler(async (req, res) => {
      const { name, email } = req.body;

      const payload = { email };

      const account = await createAccount();

      // Stores the variables for the email template
      const variables = {
        token: jwt.sign(payload, process.env.JWT_SECRET || "jwt_key", {
          expiresIn: "1w",
        }),
        protocol: process.env.NODE_ENV === "production" ? "https" : "http",
        frontend: process.env.FRONTEND_DOMAIN!,
      };

      const path = `${cwd()}/src/lib/templates/createUser.html`;
      let emailTemplate = fs.readFileSync(path, "utf8");
      let key: keyof typeof variables;
      for (key in variables) {
        emailTemplate = emailTemplate.replace(`{{${key}}}`, variables[key]);
      }

      const mail = await sendMail(email, emailTemplate);

      const user = await prisma.user.create({
        data: {
          name,
          ...account,
          email,
          role: "MEMBER",
          status: "PENDING",
        },
      });
      const grants = [
        { userId: user.id, grant: "transfer" },
        { userId: user.id, grant: "associate" },
      ];
      const permissions = await prisma.permission.createManyAndReturn({
        data: grants,
      });

      res.status(200).json({ user, permissions, email: mail });
    })
  );

  return router;
};
