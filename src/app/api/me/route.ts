import { NextResponse } from "next/server";
import { prisma } from "@app/server/db";
import { requireUser, AuthenticationError } from "@app/server/auth/require-user";

export async function GET() {
  try {
    const user = await requireUser();

    const senderProfile = await prisma.senderProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
      },
      hasSenderProfile: !!senderProfile,
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Unauthorized" } },
        { status: 401 }
      );
    }
    console.error("Get me error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
