import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAdminTokenValid, listPosts, savePost } from "@/app/lib/blog";

export async function GET(request: Request) {
  try {
    const admin = isAdminTokenValid((await cookies()).get("blog_admin")?.value);
    if (new URL(request.url).searchParams.get("admin") === "1" && !admin) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }
    return NextResponse.json(await listPosts(admin));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Blog storage is unavailable: ${error.message}`
            : "Blog storage is unavailable.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  if (!isAdminTokenValid((await cookies()).get("blog_admin")?.value)) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  try {
    const post = await savePost(await request.json());
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not save post.",
      },
      { status: 400 },
    );
  }
}
