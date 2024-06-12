import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin } from "@/schemas/coin/associate";
import { associate } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SAssociateCoin }),
    errorHandler(async (req, res) => {
      const body = req.body;
      const associateRx = await associate(body);
      res.status(200).json({ data: { ...associateRx, status: 200 } });
    })
  );

  return router;
};
