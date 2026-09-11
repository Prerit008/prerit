import { NextResponse } from "next/server";
import { createAdminToken, hashPassword } from "@/app/lib/blog";

export async function POST(request: Request) {
  const input = (await request.json()) as {
    username?: string;
    password?: string;
  };
  const username = process.env.BLOG_ADMIN_USERNAME;
  const password = process.env.BLOG_ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Blog admin credentials are not configured." },
      { status: 503 },
    );
  }
  if (
    input.username !== username ||
    hashPassword(input.password ?? "") !== hashPassword(password)
  ) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("blog_admin", createAdminToken(), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("blog_admin");
  return response;
}
