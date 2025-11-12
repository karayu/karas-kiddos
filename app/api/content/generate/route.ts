import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";
import { getGemini } from "@/lib/gemini";

type GenerateBody = {
  category: "bedtime" | "getting_out_the_door" | "chores" | "new_situations";
  type: "checklist" | "story" | "song_lyrics" | "schedule" | "calendar";
  childId?: string;
  prompt?: string;
  // Raw form data for checklists
  favoriteThing?: string;
  routineItems?: string[];
};

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = (await req.json()) as GenerateBody;
    const db = getServiceClient();

    // For checklist type, generate an image using Gemini 2.5 Flash
    if (body.type === "checklist") {
      const imagePrompt = `Create a illustrated checklist. this checklist should have a whimsical theme, appropriate for looking fun/exciting to a 5 year old. Make the protagonist a '+ favoriteThing+' unicorn, excited to do each of the steps. Make it look professionally illustrated by a children's book author like Hollie Mengert.

The name of the checklist should be: Rhea Unicorn goes to bed

On the left column, the checklist should have imagery:

1) On the first row, it should show the rainbow unicorn brushing her teeth with a proud expression on her face. Use bright colorful colors.

2) On the second row, it should show the rainbow unicorn putting on pajamas but struggling with it

3) On the third row, it should show the rainbow unicorn reading a book in bed with her eyes closed

Make the unicorn images take up half the page.

On the right column, it should just feature 3 blank rows (so that the child can write in them)

Make it good!`;

      // Use Gemini 2.5 Flash for image generation
      // Note: Gemini models are text models and don't generate images directly
      // We'll skip image generation for now and create the checklist
      let imageUrl: string | null = null;
      
      // Skip image generation for now - Gemini doesn't support it
      // TODO: Integrate with actual image generation API (Imagen, DALL-E, etc.)
      console.log("Skipping image generation - Gemini 2.5 Flash is a text model");


      // Parse routine items from prompt if available
      let steps = [
        { label: "brush teeth", tip: "Great job brushing!" },
        { label: "put on pajamas", tip: "You're doing great!" },
        { label: "read book", tip: "Time for a story!" },
      ];
      
      if (body.prompt?.includes("routine includes:")) {
        const routinePart = body.prompt.split("routine includes:")[1]?.split(".")[0];
        if (routinePart) {
          steps = routinePart.split(",").map((s: string) => ({
            label: s.trim(),
            tip: `Great job on ${s.trim()}!`,
          }));
        }
      }

      const parsed = {
        title: "Rhea Unicorn goes to bed",
        steps,
        image_url: imageUrl,
        image_prompt: imagePrompt,
      };

      try {
        const { data: inserted, error } = await db
          .from("content_items")
          .insert({
            profile_id: null,
            child_id: null,
            title: parsed.title,
            category: body.category,
            type: body.type,
            body: parsed,
            cover_url: imageUrl,
            is_public: true,
          })
          .select()
          .single();

        if (error) {
          console.error("Database insert error:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ content: inserted });
      } catch (dbError: any) {
        console.error("Database error:", dbError);
        return NextResponse.json({ error: dbError.message || "Database error" }, { status: 500 });
      }
    }

    // For other types, use text generation with Gemini
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let fullPrompt = "You are a helper for parents of young children.\n\n";
    const basePrompt = body.prompt ?? "Create a supportive, age-appropriate piece for a preschooler.";
    
    if (body.type === "story") {
      fullPrompt += `${basePrompt}\n\nCreate a supportive personalized story for a child about this situation. Return ONLY valid JSON in this exact format: {"title": "Story Title", "outline": ["point 1", "point 2"], "story_html": "<p>Full story HTML here</p>"}`;
    } else if (body.type === "song_lyrics") {
      fullPrompt += `${basePrompt}\n\nCreate playful bedtime song lyrics only. Return ONLY valid JSON: {"title": "Song Title", "lyrics": "Full lyrics text", "style": "lullaby"}`;
    } else if (body.type === "schedule" || body.type === "calendar") {
      fullPrompt += `${basePrompt}\n\nCreate a simple schedule. Return ONLY valid JSON: {"title": "Schedule Title", "items": [{"time": "9:00 AM", "label": "Activity"}]}`;
    }

    fullPrompt += "\n\nImportant: Return ONLY the JSON object, no markdown code blocks, no explanation text.";

    const completion = await model.generateContent(fullPrompt);
    let text = completion.response.text();
    
    // Clean up markdown code blocks if present
    text = text.trim();
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (text.startsWith("```")) {
      text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Text was:", text.substring(0, 200));
      // Fallback: create a simple structure
      parsed = {
        title: "Generated Story",
        outline: ["Introduction", "Main story", "Conclusion"],
        story_html: `<p>${text.replace(/\n/g, "</p><p>")}</p>`,
      };
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
  } catch (e: any) {
    console.error("Generate error:", e);
    return NextResponse.json({ error: e.message || "Generation failed" }, { status: 500 });
  }
}


