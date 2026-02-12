import { NextResponse } from "next/server";

import { errorResponse, withAuth } from "@app/shared/api/route-helpers";

import { getWorkspaces } from "@app/server/time-tracking";

export const GET = withAuth(async (user, request) => {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return errorResponse("VALIDATION_ERROR", "Provider is required", 400);
  }

  const workspaces = await getWorkspaces(user.id, provider);

  return NextResponse.json(workspaces);
});
