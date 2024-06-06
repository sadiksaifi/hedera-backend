import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STreasuryData } from "@/schemas/coin";
import { getTreasury, unfreezeStableCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    async (req, res) => {
      const query = req.query;
      const data = await getTreasury(query);
      console.log(data);
      res.json({ data });
    }
  );

  return router;
};
