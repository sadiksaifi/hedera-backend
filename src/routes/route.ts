import { router as helloRouter } from "./hello/router";
import { router as fooRouter } from "./foo/router";
import { router as createCoin } from "./coin/create/router";
import { router as deleteCoin } from "./coin/delete/router";
import { router as cashInCoin } from "./coin/cashin/router";
import { router as associateCoin } from "./coin/associate/router";
import { router as transferCoin } from "./coin/transfer/router";
import { router as freezeCoin } from "./coin/freeze/router";
import { router as unfreezeCoin } from "./coin/unfreeze/router";
import { router as treasury } from "./treasury/router";
import { router as getInfo } from "./coin/get-info/router";
import { router as updateTokenRouter } from "./role/update/router";
import { router as burnCoin } from "./coin/burn/router";
import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.use("/foo", await fooRouter());
  router.use("/hello", await helloRouter());

  // ====================== Coin routes ======================
  router.use("/coin/create", await createCoin());
  router.use("/coin/cashin", await cashInCoin());
  router.use("/coin/get-info", await getInfo());
  router.use("/coin/burn", await burnCoin());
  router.use("/treasury", await treasury());
  // =======================================================

  // ====================== Transaction routes ==============
  router.use("/coin/associate", await associateCoin());
  router.use("/coin/transfer", await transferCoin());
  // =======================================================

  // ====================== Blacklist routes ==============
  router.use("/coin/freeze", await freezeCoin());
  router.use("/coin/unfreeze", await unfreezeCoin());
  // ======================================================

  // ====================== Danger zone routes ==============
  router.use("/coin/delete", await deleteCoin());
  // ======================================================

  router.use("/role/update", await updateTokenRouter());

  return router;
};
