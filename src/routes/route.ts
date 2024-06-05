import { router as helloRouter } from "./hello/router";
import { router as fooRouter } from "./foo/router";
import { router as createCoin } from "./coin/create/router";
import { router as cashInCoin } from "./coin/cashin/router";
import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.use("/foo", await fooRouter());
  router.use("/hello", await helloRouter());

  router.use("/coin/create", await createCoin());
  router.use("/coin/cashin", await cashInCoin());

  return router;
};
