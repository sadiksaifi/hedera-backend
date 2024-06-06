import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SDeleteCoin } from "@/schemas/coin";
import { deleteStableCoin } from "@/lib/hedera";
import { StatusError } from "@hashgraph/sdk";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.delete(
    "/",
    validateRequest({ query: SDeleteCoin }),
    async (req, res) => {
      try {
        const body = req.query;
        const message = await deleteStableCoin(body);
        res.json({ data: message });
      } catch (error) {
        if (error instanceof StatusError)
          res.json({ error: error.message, status: 400 });
        else
          res.json({
            error: "something went wrong check server logs",
            status: 400,
          });
      }
    }
  );

  return router;
};
