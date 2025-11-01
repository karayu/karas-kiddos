import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

function randomToken(length = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(_: Request, { params }: { params: { contentId: string } }) {
  const token = randomToken();
  const db = getServiceClient();
  const { data, error } = await db
    .from("shares")
    .insert({ content_id: params.contentId, token })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ token: data.token, url: `${process.env.NEXT_PUBLIC_BASE_URL}/share/${data.token}` });
}


