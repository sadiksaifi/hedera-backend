import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";

const client = new PrismaClient();
const prismaAdapter = new PrismaAdapter(client.session, client.user);
const lucia = new Lucia(prismaAdapter, {
  sessionExpiresIn: new TimeSpan(2, "w"),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}

export { lucia, client as prismaClient };
