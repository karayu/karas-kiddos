import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const type = url.searchParams.get("type");
  const favoritesOnly = url.searchParams.get("favoritesOnly") === "true";
  const childId = url.searchParams.get("childId");

  const db = getServiceClient();
  let query = db
    .from("content_items")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  if (type) query = query.eq("type", type);
  if (childId) query = query.eq("child_id", childId);
  if (favoritesOnly) {
    // Public MVP: favorites not persisted server-side; ignore filter
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}


