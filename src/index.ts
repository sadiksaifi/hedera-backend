import express, { Router } from "express";
import cors from "cors";
import { router } from "@/routes/route";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { Session, User } from "lucia";
import {
  compareHostAndOrigin,
  sessionSetter,
} from "./middlewares/sessionCookieValidator";

const app = express();
config();

declare global {
  type ExpressRouter = () => Promise<Router>;
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}

(async function main() {
  app.use(cookieParser());
  app.use(express.json());
  app.use(compareHostAndOrigin);
  app.use(sessionSetter);

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use("/api", await router());

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => console.log("Listening on port: ", PORT));
})();
