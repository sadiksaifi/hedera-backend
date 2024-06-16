import { Router } from "express";
import { getCoinInfo, getTreasury } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    errorHandler(async (_, res) => {
      if (!res.locals.user) throw new Error("You are not authorized");

      const tokenList: { token_id: string; balance: string }[] =
        await getTreasury({ accountId: res.locals.user.hederaAcId });

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
