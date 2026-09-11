import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  deletePost,
  findPost,
  isAdminTokenValid,
  savePost,
} from "@/app/lib/blog";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: Context) {
  try {
    const post = await findPost((await params).slug);
    return post
      ? NextResponse.json(post)
      : NextResponse.json({ error: "Post not found." }, { status: 404 });
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

export async function PUT(request: Request, { params }: Context) {
  if (!isAdminTokenValid((await cookies()).get("blog_admin")?.value)) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  try {
    const post = await savePost(await request.json(), (await params).slug);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not update post.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_: Request, { params }: Context) {
  if (!isAdminTokenValid((await cookies()).get("blog_admin")?.value)) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }
  try {
    await deletePost((await params).slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete post.",
      },
      { status: 503 },
    );
  }
}
