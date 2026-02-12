import { NextResponse } from "next/server";

import { z } from "zod";

import { errorResponse, parseBody, withAuth } from "@app/shared/api/route-helpers";

import { connectProvider, getConnections } from "@app/server/time-tracking";

const connectSchema = z.object({
  provider: z.string().min(1),
  token: z.string().min(1),
});

export const GET = withAuth(async (user) => {
  const connections = await getConnections(user.id);

  return NextResponse.json(connections);
});

export const POST = withAuth(async (user, request) => {
  const { data, error } = await parseBody(request, connectSchema);

  if (error) {
    return error;
  }

  try {
    const connection = await connectProvider(user.id, data.provider, data.token);

    return NextResponse.json(connection, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "Invalid API token") {
      return errorResponse("VALIDATION_ERROR", "Invalid API token", 400);
    }

    throw err;
  }
});
