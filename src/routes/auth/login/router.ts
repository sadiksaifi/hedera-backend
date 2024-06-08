import { lucia } from "@/lib/auth";
import { SAuthUser } from "@/schemas/auth";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import bcryptjs from "bcryptjs";
import { errorHandler } from "@/middlewares/errorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();
export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SAuthUser),
    errorHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where: { email: email } });

      // Check User and password
      if (!user)
        throw new Error("Sorry you are not authorized to use the system");
      const isPasswordCorrect = bcryptjs.compareSync(password, user.password);
      if (!isPasswordCorrect) throw new Error("Incorrect Password");

      // Create session if email and password are correct
      const session = await lucia.createSession(user.id, {});
      const payload: JwtPayload = { userId: session.id, role: user.role };
      const token = jwt.sign(payload, process.env.JWT_SECRET || "jwt_key", {
        expiresIn: "2w",
      });

      res.status(200).json({ token });
    })
  );

  return router;
};
