import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";
import { getGemini } from "@/lib/gemini";

type GenerateBody = {
  category: "bedtime" | "getting_out_the_door" | "chores" | "new_situations";
  type: "checklist" | "story" | "song_lyrics" | "schedule" | "calendar";
  childId?: string;
  prompt?: string;
};

export async function POST(req: Request) {

  const body = (await req.json()) as GenerateBody;
  const db = getServiceClient();
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let sys = "You are a helper for parents of young children.";
  let userPrompt = body.prompt ?? "";
  let schemaHint = "Return strict JSON.";

  if (body.type === "story") {
    userPrompt = `${userPrompt}\nCreate a supportive personalized story for a child about this situation. JSON: {title, outline: string[], story_html}`;
  } else if (body.type === "checklist") {
    userPrompt = `${userPrompt}\nCreate a personalized checklist with coaching tips. JSON: {title, steps: [{label, tip}]}`;
  } else if (body.type === "song_lyrics") {
    userPrompt = `${userPrompt}\nCreate playful bedtime song lyrics only. JSON: {title, lyrics, style}`;
  } else if (body.type === "schedule" || body.type === "calendar") {
    userPrompt = `${userPrompt}\nCreate a simple schedule. JSON: {title, items: [{time, label}]}`;
  }

  const completion = await model.generateContent([{ text: sys }, { text: userPrompt }, { text: schemaHint }]);
  const text = completion.response.text();
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { title: "Generated", content: text };
  }

  const { data: inserted, error } = await db
    .from("content_items")
    .insert({
      profile_id: null,
      child_id: null,
      title: parsed.title ?? "Generated",
      category: body.category,
      type: body.type,
      body: parsed,
      is_public: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: inserted });
}


