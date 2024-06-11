import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";
import { wipe } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";
import { SWipe } from "@/schemas/coin/wipe";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.put(
    "/",
    validateRequestBody(SWipe),
    errorHandler(async (req, res) => {
      const body = req.body;
      const message = await wipe(body);
      res.status(200).json({ data: message });
    })
  );

  return router;
};
