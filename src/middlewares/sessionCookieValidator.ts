import { lucia } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";
import { verifyRequestOrigin } from "lucia";

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: can be implemented while hosting
  // const originHeader = req.headers.origin ?? null;
  // const hostHeader =
  //   req.headers.host ?? req.headers["X-Forwarded-Host"] ?? null;
  // if (!originHeader)
  //   return res.status(403).json({ message: "originHeader Not found" });
  //
  // const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || "[]");
  // if (
  //   !originHeader ||
  //   !hostHeader ||
  //   !verifyRequestOrigin(originHeader, [hostHeader, ...allowedOrigins])
  // ) {
  //   res
  //     .status(403)
  //     .json({ message: "You are not authenticated, login to continue" });
  //   return;
  // }

  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const serializedCookie = lucia.createSessionCookie(session.id).serialize();
    res.appendHeader("Set-Cookie", serializedCookie);
  }
  if (!session) {
    const blankCookie = lucia.createBlankSessionCookie().serialize();
    res.appendHeader("Set-Cookie", blankCookie);
  }
  res.locals.user = user;
  res.locals.session = session;
  next();
};
