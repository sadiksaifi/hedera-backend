import { lucia } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";

export const getSession = errorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // const authorization = req.headers.authorization;
    //
    // // ================= JWT VALIDATION ====================
    // const token = lucia.readBearerToken(authorization ?? "");
    // if (!token) {
    //   res.locals.userRole = null;
    //   res.locals.userId = null;
    //   res.locals.email = null;
    //   return next();
    // }
    // const payload = jwt.verify(token, process.env.JWT_SECRET || "jwt_key");
    // if (typeof payload === "string")
    //   throw new Error("Something wrong with jwt format, in getSession");
    //
    // res.locals.userId = payload.userId;
    // res.locals.userRole = payload.role;
    // if (payload.email) res.locals.email = payload.email;
    // else res.locals.email = null;
    // // ======================================================

    // ================= Cookie Based Authentication ====================
    const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
    if (!sessionId) {
      res.locals.userId = null;
      res.locals.userRole = null;
      res.locals.user = null;
      res.locals.hederaPvtKey = null;
      return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh)
      res.appendHeader(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize()
      );
    if (!session)
      res.appendHeader(
        "Set-Cookie",
        lucia.createBlankSessionCookie().serialize()
      );

    res.locals.user = user;
    res.locals.userId = user?.id || null;
    res.locals.userRole = user?.role || null;
    res.locals.session = session;
    res.locals.hederaPvtKey = user?.hederaPvtKey || null;
    // ===================================================================

    next();
  }
);
