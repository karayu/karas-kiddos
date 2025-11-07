import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";
import { getServiceClient } from "@/lib/supabase/server";

export default async function BedtimePage() {
  const db = getServiceClient();
  const { data: checklists } = await db
    .from("content_items")
    .select("id, title, cover_url, created_at")
    .eq("category", "bedtime")
    .eq("type", "checklist")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">Bedtime</h1>
        <div className="w-10" />
      </header>
      <main className="p-4 pb-20">
        <p className="mb-6 text-center text-sm text-[#617c89] dark:text-[#a0b3bd]">
          Stop the power struggles. Collaborate on getting to bed. Create fun new ways to get to bed faster, and stay in bed.
        </p>
        
        {/* Previously Generated Checklists */}
        {checklists && checklists.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-bold">Your Checklists</h2>
            <div className="grid grid-cols-2 gap-3">
              {checklists.map((checklist: any) => (
                <Link
                  key={checklist.id}
                  href={`/content/${checklist.id}`}
                  className="rounded-xl bg-white p-3 dark:bg-[#192730]"
                >
                  {checklist.cover_url ? (
                    <img
                      src={checklist.cover_url}
                      alt={checklist.title}
                      className="mb-2 h-32 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="mb-2 flex h-32 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                      <span className="material-symbols-outlined text-4xl text-primary">checklist</span>
                    </div>
                  )}
                  <p className="text-sm font-medium line-clamp-2">{checklist.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Bedtime Checklist */}
          <div className="rounded-xl bg-white p-4 dark:bg-[#192730]">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <span className="material-symbols-outlined text-6xl text-primary">checklist</span>
            </div>
            <h2 className="mb-2 text-lg font-bold">Bedtime Checklist</h2>
            <p className="mb-4 text-sm text-[#617c89] dark:text-[#a0b3bd]">
              Create a personalized illustrated checklist of your child's bedtime routine.
            </p>
            <Link
              href="/library/bedtime/checklist/create"
              className="block w-full rounded-full bg-primary py-2 text-center text-white"
            >
              Start
            </Link>
          </div>

          {/* Bedtime Story */}
          <div className="rounded-xl bg-white p-4 dark:bg-[#192730]">
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
              <span className="material-symbols-outlined text-6xl text-primary">auto_stories</span>
            </div>
            <h2 className="mb-2 text-lg font-bold">Bedtime Story</h2>
            <p className="mb-4 text-sm text-[#617c89] dark:text-[#a0b3bd]">
              Create a personalized storybook that you can read together.
            </p>
            <Link
              href="/library/bedtime/story/create"
              className="block w-full rounded-full bg-primary py-2 text-center text-white"
            >
              Start
            </Link>
          </div>
        </div>
      </main>
      <TabBar />
    </>
  );
}

