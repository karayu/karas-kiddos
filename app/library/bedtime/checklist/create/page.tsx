"use client";

import { useState } from "react";
import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";

export default function CreateChecklistPage() {
  const [favoriteThing, setFavoriteThing] = useState("");
  const [routineItems, setRoutineItems] = useState<string[]>(["brush teeth", "put on pajamas", "read book"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function addRoutineItem() {
    setRoutineItems([...routineItems, ""]);
  }

  function updateRoutineItem(index: number, value: string) {
    const updated = [...routineItems];
    updated[index] = value;
    setRoutineItems(updated);
  }

  function removeRoutineItem(index: number) {
    if (routineItems.length > 1) {
      setRoutineItems(routineItems.filter((_, i) => i !== index));
    }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null);
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...routineItems];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    setRoutineItems(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      // Add a new item after the current one
      const updated = [...routineItems];
      updated.splice(index + 1, 0, "");
      setRoutineItems(updated);
      // Focus the new input after a brief delay
      setTimeout(() => {
        const inputs = document.querySelectorAll<HTMLInputElement>('input[type="text"]');
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }, 0);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validItems = routineItems.filter((item) => item.trim() !== "");
    if (validItems.length === 0) {
      setError("Please add at least one bedtime routine item");
      setLoading(false);
      return;
    }

    try {
      const prompt = `Create a personalized bedtime checklist for a child whose favorite thing is "${favoriteThing}". The bedtime routine includes: ${validItems.join(", ")}. Make it fun and engaging with positive reinforcement tips.`;
      
      const res = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "bedtime",
          type: "checklist",
          prompt,
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
      setError(e.message || "Failed to generate checklist");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library/bedtime" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">Create Checklist</h1>
        <div className="w-10" />
      </header>
      <main className="p-4 pb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Your child's favorite thing</label>
            <input
              type="text"
              value={favoriteThing}
              onChange={(e) => setFavoriteThing(e.target.value)}
              placeholder="e.g., dinosaurs, princesses, trucks"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-[#192730]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">What's your bedtime routine?</label>
            <p className="mb-3 text-xs text-[#617c89] dark:text-[#a0b3bd]">
              Add items like: brush teeth, take bath, put on PJs
            </p>
            <div className="space-y-2">
              {routineItems.map((item, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex gap-2 rounded-lg transition-colors ${
                    draggedIndex === index ? "opacity-50" : ""
                  } ${dragOverIndex === index ? "bg-primary/10 dark:bg-primary/20" : ""}`}
                >
                  <div
                    className="flex h-10 w-10 cursor-move items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Drag to reorder"
                  >
                    <span className="material-symbols-outlined text-xl">drag_handle</span>
                  </div>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateRoutineItem(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={`Step ${index + 1}`}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-700 dark:bg-[#192730]"
                    onMouseDown={(e) => {
                      // Prevent dragging when clicking on input
                      e.stopPropagation();
                    }}
                  />
                  {routineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoutineItem(index)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Remove"
                      onMouseDown={(e) => {
                        // Prevent dragging when clicking delete
                        e.stopPropagation();
                      }}
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRoutineItem}
              className="mt-2 flex items-center gap-2 text-sm text-primary"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add another item
            </button>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3 text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Checklist"}
          </button>
        </form>
      </main>
      <TabBar />
    </>
  );
}

