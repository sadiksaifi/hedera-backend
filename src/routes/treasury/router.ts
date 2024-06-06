import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STreasuryData } from "@/schemas/coin";
import { getCoinInfo, getTreasury } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    async (req, res) => {
      const query = req.query;
      const tokenList = await getTreasury(query);

      const data = await Promise.all(
        tokenList.map(async (token) => {
          const { tokenId, ...tokenInfo } = await getCoinInfo({
            tokenId: token.token_id,
          });
          return {
            tokenId: tokenId.toString(),
            myBalance: token.balance,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            isDeleted: tokenInfo.isDeleted,
          };
        })
      );

      res.json({ data });
    }
  );

  return router;
};
