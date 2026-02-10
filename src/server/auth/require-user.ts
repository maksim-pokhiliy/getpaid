import { auth } from "@app/server/auth";

export class AuthenticationError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  return session.user;
}

export async function getUser() {
  const session = await auth();

  return session?.user ?? null;
}
