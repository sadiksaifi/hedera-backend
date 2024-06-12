import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";
import { validateRequestQuery } from "zod-express-middleware";
import { SPermission } from "@/schemas/permissions/grant";
import { prismaClient } from "@/lib/auth";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.delete(
    "/",
    validateRequestQuery(SPermission),
    errorHandler(async (req, res) => {
      const deletedPermissions = await prismaClient.permission.delete({
        where: {
          userId_grant: { userId: req.query.userId, grant: req.query.grant },
        },
      });

      res.status(200).json({ ...deletedPermissions });
    })
  );

  return router;
};
