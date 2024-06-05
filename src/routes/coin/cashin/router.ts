import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCashIn } from "@/schemas/coin";
import { cashIn } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SCashIn }), async (req, res) => {
    const body = req.body;
    const cashInReceipt = await cashIn(body);
    res.json({ data: { ...cashInReceipt } });
  });

  return router;
};
