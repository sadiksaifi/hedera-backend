import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin } from "@/schemas/coin";
import { associate } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SAssociateCoin }),
    async (req, res) => {
      try {
        const body = req.body;
        console.log(body);
        const associateRx = await associate(body);
        res.json({ data: { ...associateRx, status: 200 } });
      } catch (error) {
        console.log(error);
        res.json({ error: "Something went wrong", status: 400 });
      }
    }
  );

  return router;
};
