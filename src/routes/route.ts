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
import { router as grantPermission } from "./admin/permissions/grant/router";
import { router as revokePermission } from "./admin/permissions/revoke/router";
import { router as getBalances } from "./coin/get-balances/router";
import { router as createUser } from "./master/create-user/router";
import { router as deleteUser } from "./master/delete-user/router";
import { router as login } from "./auth/login/router";
import { router as setPassword } from "./auth/set-password/router";
import { router as whoAmI } from "./whoami/router";
import { router as logOut } from "./logout/router";
import { router as getAllUsers } from "./users/router";
import { router as changeUserRole } from "./users/change-role/router";
import { Router } from "express";

export const router: ExpressRouter = async () => {
  const router = Router();

  // ====================== Auth Routes ====================
  router.use("/auth/set-password", await setPassword());
  router.use("/auth/login", await login());
  // =======================================================

  router.use("/master/create-user", await createUser());
  router.use("/master/delete-user", await deleteUser());
  router.use("/admin/permissions/grant", await grantPermission());
  router.use("/admin/permissions/revoke", await revokePermission());

  router.use("/whoami", await whoAmI());
  router.use("/logout", await logOut());

  // ====================== Roles Controller ===============
  router.use("/users", await getAllUsers());
  router.use("/users/change-role", await changeUserRole());
  // =======================================================

  // TODO: implement errorHandler function in all the routes
  // ====================== Coin routes ======================
  router.use("/coin/create", await createCoin());
  router.use("/coin/wipe", await wipeCoin());
  router.use("/coin/cashin", await cashInCoin());
  router.use("/coin/get-info", await getInfo());
  router.use("/coin/burn", await burnCoin());
  router.use("/coin/get-balances", await getBalances());
  router.use("/coin/pause", await pauseCoin());
  router.use("/coin/unpause", await unpauseCoin());
  router.use("/treasury", await treasury());
  // =======================================================

  // ====================== Transaction routes ==============
  router.use("/coin/associate", await associateCoin());
  router.use("/coin/transfer", await transferCoin());
  // =======================================================

  // ====================== Blacklist routes ==============
  router.use("/coin/freeze", await freezeCoin());
  router.use("/coin/unfreeze", await unfreezeCoin());
  // ======================================================

  // ====================== Danger zone routes ==============
  router.use("/coin/delete", await deleteCoin());
  // ======================================================

  router.use("/role/update", await updateTokenRouter());

  return router;
};
