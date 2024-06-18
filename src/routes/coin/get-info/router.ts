import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCoinInfo } from "@/schemas/coin/getInfo";
import { getCoinInfo } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: SCoinInfo }),
    errorHandler(async (req, res) => {
      const { tokenId, ...token } = await getCoinInfo(req.query);
      res.status(200).json({
        data: {
          ...token,
          supply: token.totalSupply.toString(),
          tokenId: tokenId.toString(),
          supplyType: token.supplyType?.toString(),
          maxSupply: token.maxSupply?.toString(),
          tokenType: token.tokenType?.toString().split("_").join(" "),
        },
      });
    })
  );

  return router;
};
