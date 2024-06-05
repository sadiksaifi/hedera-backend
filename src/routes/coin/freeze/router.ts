import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SFreeze } from "@/schemas/coin";
import { freezeStableCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SFreeze }), async (req, res) => {
    const body = req.body;
    const receipt = await freezeStableCoin(body);
    res.json({ data: { receipt } });
  });

  return router;
};
