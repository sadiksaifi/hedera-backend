import { lucia, prismaClient } from "@/lib/auth";
import { SLogin } from "@/schemas/auth/login";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post("/", validateRequestBody(SLogin), async (req, res) => {
    try {
      const { username, password } = req.body;
      // lucia.createSession(username, {});
      res.status(200).json({});
    } catch (error) {}
  });

  return router;
};
