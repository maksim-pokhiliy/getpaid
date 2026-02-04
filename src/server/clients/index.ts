import { prisma } from "@app/server/db";
import { CreateClientInput, UpdateClientInput } from "@app/shared/schemas";

export async function getClients(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getClient(id: string, userId: string) {
  return prisma.client.findFirst({
    where: { id, userId },
  });
}

export async function createClient(userId: string, data: CreateClientInput) {
  return prisma.client.create({
    data: {
      userId,
      name: data.name,
      email: data.email,
    },
  });
}

export async function updateClient(id: string, userId: string, data: UpdateClientInput) {
  const client = await prisma.client.findFirst({
    where: { id, userId },
  });

  if (!client) {
    return null;
  }

  return prisma.client.update({
    where: { id },
    data: {
      name: data.name ?? client.name,
      email: data.email ?? client.email,
    },
  });
}

export async function deleteClient(id: string, userId: string) {
  const client = await prisma.client.findFirst({
    where: { id, userId },
  });

  if (!client) {
    return null;
  }

  return prisma.client.delete({
    where: { id },
  });
}
