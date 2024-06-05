import express, { Router } from "express";
import cors from "cors";
import { router } from "@/routes/route";

const app = express();

declare global {
  type ExpressRouter = () => Promise<Router>;
}

(async function main() {
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use("/api", await router());

  app.listen(4000, () => console.log("Listening"));
})();
