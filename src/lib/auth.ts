import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24,      // refresca si el token tiene más de 1 día
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "admin" },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
