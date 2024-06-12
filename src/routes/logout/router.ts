import { lucia } from "@/lib/auth";
import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();

  router.post(
    "/",
    errorHandler(async (_, res) => {
      if (!res.locals.session?.id) throw new Error("No Session to logout");

      const invalidatedSession = await lucia.invalidateSession(
        res.locals.session?.id || ""
      );
      res.status(200).json({ invalidatedSession });
      return;
    })
  );

  return router;
};
