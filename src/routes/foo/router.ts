import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.get("/", async (_req, res) => {
    res.send("all foos' list");
  });

  router.post("/", async (req, res) => {
    const newFoo = { foo: req.body.bar };

    res.send(newFoo);
  });

  return router;
};
