import { NextResponse } from "next/server";

import { parseBody, withAuth } from "@app/shared/api/route-helpers";
import { createTemplateSchema } from "@app/shared/schemas";

import { createTemplate, getTemplates } from "@app/server/templates";

export const GET = withAuth(async (user) => {
  const templates = await getTemplates(user.id);

  return NextResponse.json(templates);
});

export const POST = withAuth(async (user, request) => {
  const { data, error } = await parseBody(request, createTemplateSchema);

  if (error) {
    return error;
  }

  const template = await createTemplate(user.id, data);

  return NextResponse.json(template, { status: 201 });
});
