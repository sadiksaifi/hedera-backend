import express, { Router } from "express";
import { router } from "@/routes/route";

const app = express();

declare global {
  type ExpressRouter = () => Promise<Router>;
}

(async function main() {
  app.use("/api", await router());

  app.listen(4000, () => console.log("Listening"));
})();
