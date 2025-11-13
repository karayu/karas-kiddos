"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";
import { useParams } from "next/navigation";

// Placeholder prompts for each situation
const SITUATION_PROMPTS: Record<string, string> = {
  "first-day-of-school": "Create a fun, encouraging storybook about a child's first day of school. The story should help a 5-year-old feel excited and prepared for their big day. Include a conflict like feeling nervous or worried, which gets resolved by the end when they discover school is fun and they make new friends.",
  "doctors-visit": "Create a reassuring storybook about a child visiting the doctor. The story should help a 5-year-old feel calm and understand that doctors are helpers. Include a conflict like feeling scared of the doctor, which gets resolved when they realize the doctor is friendly and helps them feel better.",
  "new-sibling": "Create a heartwarming storybook about welcoming a new baby sibling into the family. The story should help a 5-year-old feel included and excited about being a big brother or sister. Include a conflict like feeling jealous or worried about sharing attention, which gets resolved when they discover how special it is to be a big sibling.",
  "dentist-visit": "Create a friendly storybook about a child visiting the dentist. The story should help a 5-year-old feel comfortable and understand that taking care of teeth is important. Include a conflict like feeling nervous about the dentist, which gets resolved when they have a positive experience and learn about healthy teeth.",
  "sleepover": "Create an adventurous storybook about a child's first sleepover at grandma's house. The story should help a 5-year-old feel excited and safe about spending the night away from home. Include a conflict like missing home or feeling homesick, which gets resolved when they have fun and realize they can enjoy new experiences.",
};

const SITUATION_TITLES: Record<string, string> = {
  "first-day-of-school": "First Day of School",
  "doctors-visit": "Doctor's Visit",
  "new-sibling": "New Sibling",
  "dentist-visit": "Dentist Visit",
  "sleepover": "Sleepover",
};

export default function CreateNewSituationStorybookPage() {
  const params = useParams();
  const situation = params.situation as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const defaultPrompt = SITUATION_PROMPTS[situation] || "Create a fun, entertaining story for a 5-year-old with a conflict that gets resolved at the end.";
  const title = SITUATION_TITLES[situation] || "New Situation";

  useEffect(() => {
    // Pre-fill with default prompt
    setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  async function handleGenerate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const storyPrompt = prompt.trim() || defaultPrompt;

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "new_situations",
          type: "storybook",
          prompt: storyPrompt,
        }),
      });

      if (!res.ok) {
        let errorText = `HTTP ${res.status}`;
        try {
          const errorData = await res.json();
          errorText = errorData.error || errorText;
        } catch {
          errorText = await res.text() || errorText;
        }
        throw new Error(errorText);
      }

      const data = await res.json();
      window.location.href = `/content/${data.content.id}`;
    } catch (e: any) {
      setError(e.message || "Failed to generate storybook");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">Create Storybook</h1>
        <div className="w-10" />
      </header>
      <main className="p-4 pb-20">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="rounded-xl bg-white p-6 dark:bg-[#192730]">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <span className="material-symbols-outlined text-6xl text-primary">auto_stories</span>
            </div>
            <h2 className="mb-2 text-lg font-bold">{title} Storybook</h2>
            <p className="mb-4 text-sm text-[#617c89] dark:text-[#a0b3bd]">
              Create a personalized 10-page illustrated storybook to help your child prepare for this new situation.
            </p>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium">Story prompt (you can customize this)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={defaultPrompt}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-[#192730] min-h-[120px]"
                rows={5}
              />
              <p className="mt-2 text-xs text-[#617c89] dark:text-[#a0b3bd]">
                This prompt will be used to generate both the storyline and illustrations for your storybook.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-white disabled:opacity-50"
            >
              {loading ? "Creating Storybook..." : "Generate Storybook"}
            </button>
            {loading && (
              <p className="mt-2 text-center text-xs text-[#617c89] dark:text-[#a0b3bd]">
                This may take a minute - we're creating 10 pages with illustrations!
              </p>
            )}
          </div>
        </form>
      </main>
      <TabBar />
    </>
  );
}

