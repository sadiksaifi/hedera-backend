import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { burn } from "@/lib/hedera";
import { SCoinBurn } from "@/schemas/coin/burn";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete(
    "/",
    validateRequest({ query: SCoinBurn }),
    errorHandler(async (req, res) => {
      const query = req.query;
      const ashes = await burn(query);
      res.status(200).json({ ...ashes });
    })
  );

  return router;
};
