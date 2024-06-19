import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin } from "@/schemas/coin/associate";
import { associate } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SAssociateCoin }),
    errorHandler(async (req, res) => {
      const { tokenId, userId } = req.body;
      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) throw new Error("User Not Found");
      if (!user.hederaAccId || !user.hederaPvtKey)
        throw new Error("Users's account id or private key is missing");

      const associateRx = await associate({
        account: { id: user.hederaAccId, key: user.hederaPvtKey },
        tokenId,
      });
      res.status(200).json({ data: { ...associateRx, status: 200 } });
    })
  );

  return router;
};
