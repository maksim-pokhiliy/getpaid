import { NextResponse } from "next/server";

import { withAuth } from "@app/shared/api/route-helpers";

import { getAllProviders } from "@app/server/time-tracking";

export const GET = withAuth(async () => {
  const providers = getAllProviders().map((p) => ({
    id: p.id,
    name: p.name,
    capabilities: p.capabilities,
  }));

  return NextResponse.json(providers);
});
