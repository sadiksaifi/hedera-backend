import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { createStableCoin } from "@/lib/hedera";
import { SNewCoin } from "@/schemas/coin/create";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequestBody(SNewCoin),
    errorHandler(async (req, res) => {
      const body = req.body;
      const coin = await createStableCoin(body);
      res.status(200).json({ data: coin });
    })
  );

  return router;
};
