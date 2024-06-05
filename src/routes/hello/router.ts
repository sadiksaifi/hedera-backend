import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get("/", (_, res) => {
    res.send("hello developer");
  });

  return router;
};
