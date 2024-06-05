import { router as helloRouter } from "./hello/router";
import { router as fooRouter } from "./foo/router";
import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.use("/foo", await fooRouter());
  router.use("/hello", await helloRouter());

  return router;
};
