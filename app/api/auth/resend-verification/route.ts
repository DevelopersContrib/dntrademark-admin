import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { options } from "@/lib/options";
import { readQueryOne } from "@/lib/db";
import { createVerificationToken, sendVerificationEmail } from "@/lib/email-verification";

export async function POST() {
  try {
    const session = await getServerSession(options);
    const uid = session?.id ? Number(session.id) : null;

    if (!uid || !Number.isFinite(uid) || uid <= 0) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const user = await readQueryOne<{
      id: number;
      email: string;
      email_verified_at: string | null;
    }>("SELECT id, email, email_verified_at FROM users WHERE id = ? LIMIT 1", [uid]);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.email_verified_at) {
      return NextResponse.json({ message: "Email is already verified." });
    }

    const token = createVerificationToken(user.id, user.email);
    const sent = await sendVerificationEmail(user.email, token);

    if (!sent) {
      return NextResponse.json(
        { error: "Could not send verification email. Please try again later." },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: "Verification email sent." });
  } catch (error) {
    console.error("[resend-verification] error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
