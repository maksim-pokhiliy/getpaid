import { prisma } from "@app/server/db";

import { decrypt, encrypt } from "./encryption";
import { getProvider, type TimeEntriesQuery } from "./providers";

export async function connectProvider(userId: string, providerId: string, token: string) {
  const provider = getProvider(providerId);
  const result = await provider.validateToken(token);

  if (!result.valid || !result.user) {
    throw new Error("Invalid API token");
  }

  const connection = await prisma.timeTrackingConnection.upsert({
    where: { userId_provider: { userId, provider: providerId } },
    update: {
      encryptedToken: encrypt(token),
      label: result.user.name,
      metadata: {
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        defaultWorkspaceId: result.user.defaultWorkspaceId,
      },
      lastUsedAt: new Date(),
    },
    create: {
      userId,
      provider: providerId,
      encryptedToken: encrypt(token),
      label: result.user.name,
      metadata: {
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        defaultWorkspaceId: result.user.defaultWorkspaceId,
      },
    },
  });

  return {
    id: connection.id,
    provider: connection.provider,
    label: connection.label,
    metadata: connection.metadata,
    connectedAt: connection.connectedAt,
  };
}

export async function disconnectProvider(userId: string, connectionId: string) {
  const connection = await prisma.timeTrackingConnection.findFirst({
    where: { id: connectionId, userId },
  });

  if (!connection) {
    return null;
  }

  await prisma.timeTrackingConnection.delete({ where: { id: connectionId } });

  return { success: true };
}

export async function getConnections(userId: string) {
  const connections = await prisma.timeTrackingConnection.findMany({
    where: { userId },
    select: {
      id: true,
      provider: true,
      label: true,
      metadata: true,
      connectedAt: true,
      lastUsedAt: true,
    },
  });

  return connections;
}

async function getDecryptedToken(userId: string, providerId: string): Promise<string> {
  const connection = await prisma.timeTrackingConnection.findUnique({
    where: { userId_provider: { userId, provider: providerId } },
  });

  if (!connection) {
    throw new Error(`No ${providerId} connection found`);
  }

  await prisma.timeTrackingConnection.update({
    where: { id: connection.id },
    data: { lastUsedAt: new Date() },
  });

  return decrypt(connection.encryptedToken);
}

export async function getWorkspaces(userId: string, providerId: string) {
  const provider = getProvider(providerId);
  const token = await getDecryptedToken(userId, providerId);

  return provider.getWorkspaces(token);
}

export async function getProjects(userId: string, providerId: string, workspaceId: string) {
  const provider = getProvider(providerId);
  const token = await getDecryptedToken(userId, providerId);

  return provider.getProjects(token, workspaceId);
}

export async function getTimeEntries(userId: string, providerId: string, query: TimeEntriesQuery) {
  const provider = getProvider(providerId);
  const token = await getDecryptedToken(userId, providerId);

  return provider.getTimeEntries(token, query);
}
