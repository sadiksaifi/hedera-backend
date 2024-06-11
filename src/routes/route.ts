import { router as createCoin } from "./coin/create/router";
import { router as deleteCoin } from "./coin/delete/router";
import { router as cashInCoin } from "./coin/cashin/router";
import { router as associateCoin } from "./coin/associate/router";
import { router as transferCoin } from "./coin/transfer/router";
import { router as freezeCoin } from "./coin/freeze/router";
import { router as unfreezeCoin } from "./coin/unfreeze/router";
import { router as pauseCoin } from "./coin/pause/router";
import { router as wipeCoin } from "./coin/wipe/router";
import { router as unpauseCoin } from "./coin/unpause/router";
import { router as treasury } from "./treasury/router";
import { router as getInfo } from "./coin/get-info/router";
import { router as updateTokenRouter } from "./role/update/router";
import { router as burnCoin } from "./coin/burn/router";
import { router as getBalances } from "./coin/get-balances/router";
import { router as createUser } from "./auth/create-user/router";
import { router as deleteUser } from "./auth/delete-user/router";
import { router as login } from "./auth/login/router";
import { router as setPassword } from "./auth/set-password/router";
import { router as whoAmI } from "./auth/whoami/router";
import { router as logOut } from "./auth/logout/router";
import { router as getAllUsers } from "./users/router";
import { router as changeUserRole } from "./users/change-role/router";
import { Router } from "express";
import { authorizeMaster } from "@/middlewares/authorizeMaster";
import { authorizeMember } from "@/middlewares/authorizeMember";
import { authorizeAdmin } from "@/middlewares/authorizeAdmin";

export const router: ExpressRouter = async () => {
  const router = Router();

  // ====================== Auth Routes ====================
  router.use("/auth/create-user", authorizeMaster, await createUser());
  router.use("/auth/delete-user", authorizeMaster, await deleteUser());
  router.use("/auth/set-password", await setPassword());
  router.use("/auth/login", await login());
  router.use("/auth/whoami", authorizeMember, await whoAmI());
  router.use("/auth/logout", authorizeMember, await logOut());
  // =======================================================
  // ====================== Roles Controller ===============
  router.use("/users", authorizeMember, await getAllUsers());
  router.use("/users/change-role", authorizeAdmin, await changeUserRole());
  // =======================================================

  // TODO: implement errorHandler function in all the routes
  // ====================== Coin routes ======================
  router.use("/coin/create", authorizeAdmin, await createCoin());
  router.use("/coin/wipe", authorizeAdmin, await wipeCoin());
  router.use("/coin/cashin", authorizeMember, await cashInCoin());
  router.use("/coin/get-info", authorizeMember, await getInfo());
  router.use("/coin/burn", authorizeMember, await burnCoin());
  router.use("/coin/get-balances", authorizeMember, await getBalances());
  router.use("/coin/pause", authorizeMember, await pauseCoin());
  router.use("/coin/unpause", authorizeMember, await unpauseCoin());
  router.use("/treasury", authorizeMember, await treasury());
  // =======================================================

  // ====================== Transaction routes ==============
  router.use("/coin/associate", authorizeMember, await associateCoin());
  router.use("/coin/transfer", authorizeMember, await transferCoin());
  // =======================================================

  // ====================== Blacklist routes ==============
  router.use("/coin/freeze", authorizeMember, await freezeCoin());
  router.use("/coin/unfreeze", authorizeMember, await unfreezeCoin());
  // ======================================================

  // ====================== Danger zone routes ==============
  router.use("/coin/delete", authorizeMember, await deleteCoin());
  // ======================================================

  router.use("/role/update", authorizeMember, await updateTokenRouter());

  return router;
};
