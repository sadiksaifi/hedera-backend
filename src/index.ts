import express, { Router } from "express";
import cors from "cors";
import { router } from "@/routes/route";
import { config } from "dotenv";

const app = express();
config();

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

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => console.log("Listening on port: ", PORT));
})();
