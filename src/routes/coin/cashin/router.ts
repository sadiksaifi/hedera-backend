import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCashIn } from "@/schemas/coin/cashin";
import { cashIn } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SCashIn }),
    errorHandler(async (req, res) => {
      const body = req.body;
      const cashInReceipt = await cashIn(body);
      res.status(200).json({ data: { ...cashInReceipt } });
    })
  );

  return router;
};
