import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Permission, PrismaClient, User } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";

const client = new PrismaClient();
const prismaAdapter = new PrismaAdapter(client.session, client.user);
const lucia = new Lucia(prismaAdapter, {
  sessionExpiresIn: new TimeSpan(2, "w"),
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      role: attributes.role,
      email: attributes.email,
      hederaAcId: attributes.hederaAccId,
      hederaPvtKey: attributes.hederaPvtKey,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  role: User["role"];
  email: string;
  hederaAccId: string;
  hederaPvtKey: string;
}

export { lucia, client as prismaClient };
