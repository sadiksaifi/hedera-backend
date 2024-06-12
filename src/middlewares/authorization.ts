import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
 * Auth Routes
  "/auth/login"
  "/auth/set-password"
  
 * Master Routes
  "/create-user",
  "/delete-user",

 * Private Routes
  "/whoami",
  "/logout",
  "/users",
  "/users/change-role",
  "/coin/create",
  "/coin/wipe",
  "/coin/cashin",
  "/coin/get-info",
  "/coin/burn",
  "/coin/get-balances",
  "/coin/pause",
  "/coin/unpause",
  "/coin/associate",
  "/coin/transfer",
  "/coin/freeze",
  "/coin/unfreeze",
  "/coin/delete",
  "/treasury",
  "/role/update",
*/

const protectedRoutes = [
  { grant: "create", route: "/coin/create" },
  { grant: "wipe", route: "/coin/wipe" },
  { grant: "burn", route: "/coin/burn" },
  { grant: "pause", route: "/coin/pause" },
  { grant: "unpause", route: "/coin/unpause" },
  { grant: "associate", route: "/coin/associate" },
  { grant: "transfer", route: "/coin/transfer" },
  { grant: "freeze", route: "/coin/freeze" },
  { grant: "unfreeze", route: "/coin/unfreeze" },
  { grant: "cashin", route: "/coin/cashin" },
];

export const authorize = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, session } = res.locals;
    const url = req.url;

    if (url.startsWith("/api/auth")) return next();
    else if (!user || !session)
      throw new Error("Unauthorized Acces denied, login to continue");

    if (user.role === "MASTER") return next();
    else if (user.role === "ADMIN" && !url.startsWith("/api/master"))
      return next();
    else if (url.search("/master") > 0)
      throw new Error("You are not authorized to perform this action");
    else if (url.search("/admin") > 0)
      throw new Error("You are not authorized to perform this action");

    if (user.role === "MEMBER") {
      const grantRoute = protectedRoutes.find((routes) => {
        return url.search(routes.route) > 0;
      });
      if (grantRoute) {
        const permissions = await prisma.permission.findFirst({
          where: { userId: user.id, grant: grantRoute?.grant },
        });
        if (!permissions)
          throw new Error("Your are not authorized to perform this action");
      }
    }
    next();
  }
);
