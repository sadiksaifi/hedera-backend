import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();
export const createFirstAccount = async () => {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync("Master1234", salt);
    const user = await prisma.user.create({
      data: {
        name: "First-Master",
        hederaAccId: "Hedera Account",
        hederaPubKey: "Hedera Public Key",
        email: "master@gmail.com",
        role: "MASTER",
        status: "ACTIVE",
        password: passwordHash,
      },
    });
    console.log("Created a test user: ", user);
  } catch (error) {}
};
