import { Router } from "express";
import { errorHandler } from "@/middlewares/errorHandler";

export const router: ExpressRouter = async () => {
  const router = Router();
  router.get(
    "/",
    errorHandler(async (req, res) => {
      res.status(200).json({ session: res.locals.session });
    })
  );

  return router;
};
