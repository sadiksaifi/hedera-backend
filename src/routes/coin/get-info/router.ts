import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCoinInfo } from "@/schemas/coin";
import { getCoinInfo } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get("/", validateRequest({ query: SCoinInfo }), async (req, res) => {
    try {
      const { tokenId, ...token } = await getCoinInfo(req.query);
      res.json({
        data: {
          ...token,
          supplyType: token.supplyType?.toString(),
          supply: token.totalSupply.toString(),
          tokenId: tokenId.toString(),
        },
      });
    } catch (error) {
      res.json({ error: "Something went wrong", status: 400 });
    }
  });

  return router;
};
