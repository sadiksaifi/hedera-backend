import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { validateRequestBody } from "zod-express-middleware";
import { SPermission } from "@/schemas/permissions/grant";
import { prismaClient } from "@/lib/auth";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.post(
    "/",
    validateRequestBody(SPermission),
    errorHandler(async (req, res) => {
      const permissions = await prismaClient.permission.create({
        data: { userId: req.body.userId, grant: req.body.grant },
      });

      res.status(200).json({ ...permissions });
    })
  );

  return router;
};
