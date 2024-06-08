import { lucia } from "@/lib/auth";
import { NextFunction, Request, Response } from "express";
import { verifyRequestOrigin } from "lucia";

export const compareHostAndOrigin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") return next();

  const originHeader = req.headers.origin ?? null;

  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader =
    req.headers.host ?? req.headers["X-Forwarded-Host"] ?? null;
  if (!originHeader) return res.status(403).end();

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(
      originHeader,
      JSON.parse(process.env.ALLOWED_ORIGINS || "[]")
    )
  ) {
    res.status(403).end();
    return;
  }
  next();
};

export const sessionSetter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }
  console.log(sessionId);

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }
  res.locals.user = user;
  res.locals.session = session;
  next();
};
