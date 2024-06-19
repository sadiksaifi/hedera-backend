import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SCoinInfo } from "@/schemas/coin/getInfo";
import { getTreasury } from "@/lib/hedera";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get(
    "/",
    validateRequest({ query: SCoinInfo }),
    errorHandler(async (req, res) => {
      if (!res.locals.user) throw new Error("You are not authorized");
      const { tokenId } = req.query;

      const allTokens: {
        token_id: string;
        balance: number;
        decimals: number;
      }[] = await getTreasury({ accountId: res.locals.user.hederaAcId });
      const tok = allTokens.find(({ token_id }) => token_id === tokenId);

      const balance = isNaN(Number(tok?.balance))
        ? 0
        : Number(tok?.balance) / 10 ** (tok?.decimals || 0);

      res.status(200).send(balance.toString());
    })
  );

  return router;
};
