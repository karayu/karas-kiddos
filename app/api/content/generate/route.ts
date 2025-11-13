import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";
import { getGemini } from "@/lib/gemini";

type GenerateBody = {
  category: "bedtime" | "getting_out_the_door" | "chores" | "new_situations";
  type: "checklist" | "story" | "song_lyrics" | "schedule" | "calendar" | "storybook";
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
      // Get favorite thing and routine items from form data
      const favoriteThing = body.favoriteThing || "unicorn";
      const routineItems = body.routineItems && body.routineItems.length > 0 
        ? body.routineItems.filter((item: string) => item.trim() !== "")
        : ["brush teeth", "put on pajamas", "read book"];
      
      // Build the checklist name
      const checklistName = `Rhea the ${favoriteThing} goes to bed`;
      
      // Build the imagery descriptions for each routine item with colorful descriptions
      const imageryDescriptions = routineItems.map((item: string, index: number) => {
        const itemNum = index + 1;
        const isFirst = index === 0;
        const isLast = index === routineItems.length - 1;
        
        // Add colorful descriptions based on position
        let description = "";
        if (isFirst) {
          description = `with a proud smile on their face. Use bright colorful colors.`;
        } else if (isLast) {
          // Special handling for reading/book items
          if (item.toLowerCase().includes('read') || item.toLowerCase().includes('book')) {
            description = `in bed with their eyes closed, looking peaceful and sleepy.`;
          } else {
            description = `with a happy, content expression.`;
          }
        } else if (index === 1) {
          description = `but struggling with it, looking determined.`;
        } else {
          description = `with focused concentration.`;
        }
        
        return `${itemNum}) On the ${isFirst ? 'first' : isLast && routineItems.length > 2 ? 'last' : itemNum === 2 ? 'second' : `${itemNum}th`} row, it should show the ${favoriteThing} ${item} ${description}`;
      }).join('\n\n');
      
      const imagePrompt = `Create an illustrated checklist. This checklist should have a whimsical theme, appropriate for looking fun/exciting to a 5 year old. Make the protagonist a ${favoriteThing}, excited to do each of the steps. Make it look professionally illustrated by a children's book author like Hollie Mengert.

The name of the checklist should be: ${checklistName}

On the left column, the checklist should have imagery:

${imageryDescriptions}

Make the ${favoriteThing} images take up half the page.

On the right column, it should just feature ${routineItems.length} blank rows (so that the child can write in them)

Make it good!`;

      console.log("Image Prompt:", imagePrompt);
      console.log("======================");

      // Use Gemini 2.5 Flash Image for image generation
      // Reference: https://ai.google.dev/gemini-api/docs/image-generation#javascript
      
      let imageUrl: string | null = null;
      
      try {
        const genAI = getGemini();
        // Use the correct model name for image generation
        const model = genAI.getGenerativeModel({ 
          model: "gemini-2.5-flash-image"
        });
        
        console.log("=== Calling Gemini for Image Generation ===");
        console.log("Model: gemini-2.5-flash-image");
        console.log("Image Prompt:", imagePrompt);
        
        // Generate image using Gemini 2.5 Flash Image
        const completion = await model.generateContent(imagePrompt);
        
        const response = completion.response;
        
        console.log("=== Gemini Response ===");
        console.log("Candidates:", response.candidates?.length);
        
        // Check for image data in the response parts
        let base64Image: string | null = null;
        
        // Iterate through all parts in the response
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            console.log("Part keys:", Object.keys(part));
            
            // Check for inlineData (image data)
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              console.log("Found image in inlineData, mimeType:", part.inlineData.mimeType);
              break; // Found the image, no need to check other parts
            }
            
            // Check for text (might contain image description or URL)
            if (part.text) {
              console.log("Part text preview:", part.text.substring(0, 200));
            }
          }
        }
        
        console.log("Base64 image found:", base64Image ? "Yes" : "No");
        console.log("======================");

        // If we have a base64 image, save it to Supabase Storage
        if (base64Image) {
          try {
            const imageBuffer = Buffer.from(base64Image, "base64");
            const fileName = `checklists/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
            
            const { data: uploadData, error: uploadError } = await db.storage
              .from("checklists")
              .upload(fileName, imageBuffer, {
                contentType: "image/png",
                upsert: false,
              });

            if (!uploadError && uploadData) {
              const { data: urlData } = db.storage
                .from("checklists")
                .getPublicUrl(fileName);
              imageUrl = urlData.publicUrl;
              console.log("Image saved to Supabase Storage:", imageUrl);
              console.log("🔗 Direct link to generated image:", imageUrl);
            } else {
              console.error("Storage upload error:", uploadError);
              // Fallback to data URL if storage fails
              imageUrl = `data:image/png;base64,${base64Image}`;
            }
          } catch (storageError: any) {
            console.error("Storage error:", storageError);
            imageUrl = `data:image/png;base64,${base64Image}`;
          }
        } else {
          console.log("No image data found in Gemini response");
        }
      } catch (imageError: any) {
        console.error("Image generation error:", imageError.message || imageError);
        // Continue without image - we'll still create the checklist
      }

      // Build steps from the same routineItems we used for the image prompt
      const steps = routineItems.map((item: string) => ({
        label: item.trim(),
        tip: `Great job on ${item.trim()}!`,
      }));

      const parsed = {
        title: checklistName,
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

    // For storybook type, generate a 10-page illustrated storybook
    if (body.type === "storybook") {
      try {
        const genAI = getGemini();
        const textModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

      const basePrompt = body.prompt || "Create a fun, entertaining story for a 5-year-old with a conflict that gets resolved at the end.";
      
      // Step 1: Generate the story structure (10 pages)
      const storyPrompt = `${basePrompt}

Create a professional, whimsical 10-page storybook for a 5-year-old child. The story should:
- Have a clear conflict that gets resolved by the end
- Be entertaining and age-appropriate
- Be professional and whimsical in style, like the illustrations by Hollie Mengert or Daniel Salmieri
- Each page should have 2-3 sentences of text

IMPORTANT FOR ILLUSTRATIONS:
- All illustrations must use the SAME drawing style across all 10 pages
- The protagonist must look EXACTLY the same in every illustration (same appearance, clothing, colors, physical features)
- The artistic style should be professional and whimsical, consistent throughout the entire storybook

Return ONLY valid JSON in this exact format:
{
  "title": "Story Title",
  "protagonistDescription": "Detailed description of the protagonist's appearance, including physical features, clothing, colors, and any distinctive characteristics. This description will be used to ensure the protagonist looks identical across all 10 pages.",
  "pages": [
    {"pageNumber": 1, "text": "Page 1 text here", "imageDescription": "Detailed description of what should be illustrated on this page"},
    {"pageNumber": 2, "text": "Page 2 text here", "imageDescription": "Detailed description..."},
    ... (10 pages total)
  ]
}

Important: Return ONLY the JSON object, no markdown code blocks, no explanation text.`;

      console.log("=== Generating Storybook Structure ===");
      const storyCompletion = await textModel.generateContent(storyPrompt);
      let storyText = storyCompletion.response.text();
      
      // Clean up markdown code blocks
      storyText = storyText.trim();
      if (storyText.startsWith("```json")) {
        storyText = storyText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (storyText.startsWith("```")) {
        storyText = storyText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      
      let storyData: any;
      try {
        storyData = JSON.parse(storyText);
        console.log("Parsed story data:", JSON.stringify(storyData, null, 2).substring(0, 500));
      } catch (parseError: any) {
        console.error("Story JSON parse error:", parseError);
        console.error("Raw story text:", storyText.substring(0, 500));
        return NextResponse.json({ 
          error: "Failed to parse story structure", 
          details: parseError.message,
          rawText: storyText.substring(0, 200)
        }, { status: 500 });
      }

      if (!storyData.pages || !Array.isArray(storyData.pages)) {
        console.error("Invalid pages data:", storyData);
        return NextResponse.json({ 
          error: "Story structure missing pages array",
          received: Object.keys(storyData)
        }, { status: 500 });
      }

      if (storyData.pages.length !== 10) {
        console.error(`Expected 10 pages, got ${storyData.pages.length}`);
        return NextResponse.json({ 
          error: `Story must have exactly 10 pages, got ${storyData.pages.length}` 
        }, { status: 500 });
      }

      console.log(`Generated story structure: ${storyData.title} with ${storyData.pages.length} pages`);
      console.log(`Protagonist description: ${storyData.protagonistDescription ? "Present" : "Missing (optional)"}`);

      // Step 2: Generate images for each page
      const pagesWithImages = [];
      let coverImageUrl: string | null = null;
      let firstAvailableImageUrl: string | null = null;

      for (let i = 0; i < storyData.pages.length; i++) {
        const page = storyData.pages[i];
        console.log(`Generating image for page ${page.pageNumber}...`);

        // Get protagonist description from story data for consistency
        const protagonistDesc = storyData.protagonistDescription || "";
        
        // Build style consistency instructions
        let styleConsistencyNote = "";
        if (i === 0) {
          styleConsistencyNote = "This is the first page - establish the artistic style that will be used consistently across all 10 pages.";
        } else {
          styleConsistencyNote = "CRITICAL: Use the EXACT same artistic style, color palette, and illustration technique as page 1. The drawing style must be identical to maintain visual consistency throughout the storybook.";
        }
        
        const imagePrompt = `Create a professional, whimsical children's book illustration in the style of Hollie Mengert or Daniel Salmieri. The illustration should be:
- Professional and whimsical, with a cohesive artistic style
- Colorful, playful, and suitable for a 5-year-old
- High-quality, like a published picture book

${styleConsistencyNote}

${protagonistDesc ? `CRITICAL: The protagonist must look exactly like this in every illustration: ${protagonistDesc}. Make sure the protagonist's appearance (physical features, clothing, colors, etc.) is identical across all pages.` : ""}

${page.imageDescription}

${protagonistDesc ? `Remember: The protagonist must match the description provided above exactly.` : ""}

Make it bright, engaging, and professional. The illustration should fill the entire image and be suitable for a storybook page. Ensure the artistic style is consistent with the other pages in this storybook.`;

        try {
          const imageCompletion = await imageModel.generateContent(imagePrompt);
          const imageResponse = imageCompletion.response;
          
          let base64Image: string | null = null;
          
          // Extract image from response
          if (imageResponse.candidates?.[0]?.content?.parts) {
            for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData) {
                base64Image = part.inlineData.data;
                break;
              }
            }
          }

          if (base64Image) {
            // Save to Supabase Storage
            const imageBuffer = Buffer.from(base64Image, "base64");
            const fileName = `storybooks/${Date.now()}-${Math.random().toString(36).substring(7)}-page-${page.pageNumber}.png`;
            
            const { data: uploadData, error: uploadError } = await db.storage
              .from("checklists") // Using checklists bucket for now, could create a storybooks bucket
              .upload(fileName, imageBuffer, {
                contentType: "image/png",
                upsert: false,
              });

            if (!uploadError && uploadData) {
              const { data: urlData } = db.storage
                .from("checklists")
                .getPublicUrl(fileName);
              const imageUrl = urlData.publicUrl;
              
              pagesWithImages.push({
                pageNumber: page.pageNumber,
                text: page.text,
                imageUrl: imageUrl,
                imageDescription: page.imageDescription,
              });

              // Use first page as cover/thumbnail
              if (page.pageNumber === 1) {
                coverImageUrl = imageUrl;
                console.log(`✓ Cover/thumbnail set from page 1: ${imageUrl}`);
              }
              
              // Track first available image as fallback
              if (!firstAvailableImageUrl) {
                firstAvailableImageUrl = imageUrl;
              }

              console.log(`✓ Page ${page.pageNumber} image saved: ${imageUrl}`);
            } else {
              console.error(`Upload error for page ${page.pageNumber}:`, uploadError);
              // Continue without image for this page
              pagesWithImages.push({
                pageNumber: page.pageNumber,
                text: page.text,
                imageUrl: null,
                imageDescription: page.imageDescription,
              });
            }
          } else {
            console.log(`No image data found for page ${page.pageNumber}`);
            pagesWithImages.push({
              pageNumber: page.pageNumber,
              text: page.text,
              imageUrl: null,
              imageDescription: page.imageDescription,
            });
          }
        } catch (imageError: any) {
          console.error(`Image generation error for page ${page.pageNumber}:`, imageError.message);
          // Continue without image
          pagesWithImages.push({
            pageNumber: page.pageNumber,
            text: page.text,
            imageUrl: null,
            imageDescription: page.imageDescription,
          });
        }

        // Add a small delay between image generations to avoid rate limits
        if (i < storyData.pages.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Ensure we have a cover image - use first page if available, otherwise first available image
      if (!coverImageUrl && firstAvailableImageUrl) {
        coverImageUrl = firstAvailableImageUrl;
        console.log(`✓ Using first available image as cover/thumbnail: ${coverImageUrl}`);
      }

      // Step 3: Save storybook to database
      const storybookData = {
        title: storyData.title,
        pages: pagesWithImages,
        originalPrompt: basePrompt,
      };

      console.log("=== Saving Storybook ===");
      console.log("Title:", storybookData.title);
      console.log("Cover/Thumbnail URL:", coverImageUrl);
      console.log("Number of pages:", pagesWithImages.length);
      
      const { data: inserted, error } = await db
        .from("content_items")
        .insert({
          profile_id: null,
          child_id: null,
          title: storybookData.title,
          category: body.category,
          type: "story", // Using "story" type since "storybook" isn't in the enum yet
          body: storybookData,
          cover_url: coverImageUrl, // This is the thumbnail from the first page image
          is_public: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("=== Storybook Generated Successfully ===");
      console.log("Storybook ID:", inserted.id);
      console.log("Cover URL saved:", inserted.cover_url);
      return NextResponse.json({ content: inserted });
      } catch (storybookError: any) {
        console.error("=== Storybook Generation Error ===");
        console.error("Error:", storybookError);
        console.error("Stack:", storybookError.stack);
        return NextResponse.json({ 
          error: storybookError.message || "Storybook generation failed",
          details: storybookError.stack?.substring(0, 500)
        }, { status: 500 });
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
    console.error("=== Generate Error ===");
    console.error("Error message:", e.message);
    console.error("Error stack:", e.stack);
    console.error("Error details:", e);
    return NextResponse.json({ 
      error: e.message || "Generation failed",
      details: e.stack?.substring(0, 500)
    }, { status: 500 });
  }
}


