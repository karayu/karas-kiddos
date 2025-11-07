"use client";

import { useState } from "react";

export function CreatePublicGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(kind: { category: string; type: string }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: kind.category,
          type: kind.type,
          prompt: "Create a supportive, age-appropriate piece for a preschooler.",
        }),
      });
      if (!res.ok) {
        let errorData: { error?: string };
        try {
          errorData = await res.json();
        } catch {
          const errorText = await res.text();
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      window.location.reload();
    } catch (e: any) {
      setError(e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => generate({ category: "new_situations", type: "story" })}
        disabled={loading}
        className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20"
      >
        <span className="material-symbols-outlined text-2xl"> add </span>
      </button>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}


