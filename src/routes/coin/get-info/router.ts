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

      console.log(token.totalSupply.toNumber() / Math.pow(10, token.decimals));

      res.status(200).json({
        data: {
          ...token,
          tokenId: tokenId.toString(),
          supplyType: token.supplyType?.toString(),
          maxSupply: token.maxSupply
            ? token.maxSupply.toNumber() / Math.pow(10, token.decimals)
            : null,
          supply: token.totalSupply.toNumber() / Math.pow(10, token.decimals),
          tokenType: token.tokenType?.toString().split("_").join(" "),
        },
      });
    })
  );

  return router;
};
