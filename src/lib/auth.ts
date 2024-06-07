import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";

const client = new PrismaClient();
const prismaAdapter = new PrismaAdapter(client.session, client.user);
const lucia = new Lucia(prismaAdapter, {
  sessionExpiresIn: new TimeSpan(15, "d"),
  sessionCookie: {
    attributes: {
      secure: true,
    },
  },
  getSessionAttributes: (attributes) => {
    return {};
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
  }

  interface DatabaseSessionAttributes {}
}

export { lucia, client as prismaClient };
