import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SUnfreeze } from "@/schemas/coin";
import { unfreezeStableCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SUnfreeze }), async (req, res) => {
    const body = req.body;
    const receipt = await unfreezeStableCoin(body);
    res.json({ data: { receipt } });
  });

  return router;
};
