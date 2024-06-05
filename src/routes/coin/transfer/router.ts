import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STransfer } from "@/schemas/coin";
import { transferCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: STransfer }), async (req, res) => {
    const body = req.body;
    const transferRx = await transferCoin(body);
    res.json({ data: { ...transferRx } });
  });

  return router;
};
