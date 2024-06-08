import express, { Router } from "express";
import cors from "cors";
import { router } from "@/routes/route";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { User } from "@prisma/client";
import { getSession } from "./middlewares/sessionCookieValidator";
import jwt from "jsonwebtoken";

const app = express();
config();

declare global {
  type ExpressRouter = () => Promise<Router>;
  namespace Express {
    interface Locals {
      userId: string | null;
      userRole: User["role"] | null;
    }
  }
}
declare module "jsonwebtoken" {
  interface JwtPayload extends jwt.JwtPayload {
    userId: string;
    role: User["role"];
  }
}

(async function main() {
  app.use(cookieParser());
  app.use(express.json());
  app.use(getSession);

  app.use(
    cors({
      origin: "*",
    })
  );

  app.use("/api", await router());

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => console.log("Listening on port: ", PORT));
})();
