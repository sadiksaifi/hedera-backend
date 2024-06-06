import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { SUpdateTokenRole } from "@/schemas/role";
import { client, pK } from "@/lib/hedera";
import { PublicKey, TokenUpdateTransaction } from "@hashgraph/sdk";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    validateRequest({ body: SUpdateTokenRole }),
    async (req, res) => {
      try {
        const mapFn = {
          metadataKey: "setMetadataKey",
          kycKey: "setKycKey",
          freezeKey: "setFreezeKey",
          pauseKey: "setPauseKey",
          wipeKey: "setWipeKey",
          supplyKey: "setSupplyKey",
        } as const;

        const { token, publicKey, roles } = req.body;

        const tx = new TokenUpdateTransaction().setTokenId(token);

        roles.forEach((role) => {
          const method = mapFn[role];

          tx[method](PublicKey.fromString(publicKey));
        });

        const signTx = await tx.freezeWith(client).sign(pK);

        const txResponse = await signTx.execute(client);

        const receipt = await txResponse.getReceipt(client);

        //Get the transaction consensus status
        const transactionStatus = receipt.status.toString();
        res.send(transactionStatus);
      } catch (error) {
        res.status(400).json({ error: "Something went wrong" });
      }
    }
  );

  return router;
};
