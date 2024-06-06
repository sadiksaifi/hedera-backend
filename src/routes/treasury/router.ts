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

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: STreasuryData }),
    async (req, res) => {
      try {
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

        res.status(200).json({ data });
      } catch (error) {
        console.log(error);
        if (
          error instanceof StatusError ||
          error instanceof ReceiptStatusError ||
          error instanceof BadKeyError ||
          error instanceof BadMnemonicError ||
          error instanceof PrecheckStatusError
        )
          return res
            .status(400)
            .json({ message: error.message, name: error.name });

        return res.status(500).json({ message: "Something went wrong" });
      }
    }
  );

  return router;
};
