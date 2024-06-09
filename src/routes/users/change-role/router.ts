import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { errorHandler } from "@/middlewares/errorHandler";
import { SChangeRole } from "@/schemas/changeRole";

const prisma = new PrismaClient();
export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SChangeRole }),
    errorHandler(async (req, res) => {
      const { id, role } = req.body;
      if (res.locals.userRole === "MEMBER")
        throw new Error("Member can't elevate previlages");
      if (res.locals.userRole === "ADMIN" && role === "MASTER")
        throw new Error("Admin Can't elevate previlage above Admin");

      const newRole = await prisma.user.update({
        where: { id },
        data: { role },
      });
      res.status(200).json(newRole);
    })
  );

  return router;
};
