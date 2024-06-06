import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SAssociateCoin, SCoinBurn } from "@/schemas/coin";
import { burn } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequest({ body: SCoinBurn }), async (req, res) => {
    try {
      const body = req.body;
      const ashes = await burn(body);
      res.json({ ...ashes });
    } catch (error) {
      res.send(400).json({ error: "Something went wrong" });
    }
  });

  return router;
};
