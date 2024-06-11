import { Router } from "express";
import { validateRequestQuery } from "zod-express-middleware";
import { pause } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";
import { SPauseToken } from "@/schemas/coin/pause";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.put(
    "/",
    validateRequestQuery(SPauseToken),
    errorHandler(async (req, res) => {
      const body = req.query;
      const message = await pause(body);
      res.status(200).json({ data: message });
    })
  );

  return router;
};
