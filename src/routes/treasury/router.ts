import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { STreasuryData } from "@/schemas/coin";
import { getCoinInfo, getTreasury } from "@/lib/hedera";
import {
  StatusError,
  ReceiptStatusError,
  BadKeyError,
  BadMnemonicError,
  PrecheckStatusError,
} from "@hashgraph/sdk";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    errorHandler(async (req, res) => {
      const query = req.query;
      const tokenList: { token_id: string; balance: string }[] =
        await getTreasury(query);

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

      res.status(200).json({ data });
    })
  );

  return router;
};
