import { NextResponse } from "next/server";

import { withAuth } from "@app/shared/api/route-helpers";

import { getAnalytics } from "@app/server/analytics";

export const GET = withAuth(async (user) => {
  const analytics = await getAnalytics(user.id);

  return NextResponse.json(analytics);
});
