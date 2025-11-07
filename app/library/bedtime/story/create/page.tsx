"use client";

import { useState } from "react";
import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";

export default function CreateStoryPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "bedtime",
          type: "story",
          prompt: "Create a calming, personalized bedtime story that helps a child wind down and feel safe. Make it age-appropriate for a preschooler.",
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
      setError(e.message || "Failed to generate story");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library/bedtime" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">Create Story</h1>
        <div className="w-10" />
      </header>
      <main className="p-4 pb-20">
        <div className="rounded-xl bg-white p-6 dark:bg-[#192730]">
          <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
            <span className="material-symbols-outlined text-6xl text-primary">auto_stories</span>
          </div>
          <h2 className="mb-2 text-lg font-bold">Bedtime Story</h2>
          <p className="mb-6 text-sm text-[#617c89] dark:text-[#a0b3bd]">
            Create a personalized storybook that you can read together.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Generate Story"}
          </button>
        </div>
      </main>
      <TabBar />
    </>
  );
}

