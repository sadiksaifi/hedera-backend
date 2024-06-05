import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin } from "@/schemas/coin";
import { associate } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SAssociateCoin }),
    async (req, res) => {
      const body = req.body;
      const associateRx = await associate(body);
      res.json({ data: { ...associateRx } });
    }
  );

  return router;
};
