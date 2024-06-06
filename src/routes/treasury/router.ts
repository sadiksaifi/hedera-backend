import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STreasuryData } from "@/schemas/coin";
import { getCoinInfo, getTreasury, unfreezeStableCoin } from "@/lib/hedera";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    async (req, res) => {
      const query = req.query;
      const tokenList = await getTreasury(query);

      const data: {
        name: string;
        symbol: string;
        tokenId: string;
        myBalance: number;
        isDeleted: boolean;
      }[] = [];

      for (let i = 0; i < 5; i++) {
        const { tokenId, ...token } = await getCoinInfo({
          tokenId: tokenList[i].token_id,
        });
        data.push({
          tokenId: tokenId.toString(),
          myBalance: tokenList[i].balance,
          name: token.name,
          symbol: token.symbol,
          isDeleted: token.isDeleted,
        });
      }

      res.json({ data });
    }
  );

  return router;
};
