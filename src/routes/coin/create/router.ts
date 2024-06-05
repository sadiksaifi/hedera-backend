import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SNewCoin } from "@/schemas/coin";
import { createStableCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SNewCoin }), async (req, res) => {
    const body = req.body;
    const coin = await createStableCoin(body);
    res.json({ data: coin });
  });

  return router;
};
