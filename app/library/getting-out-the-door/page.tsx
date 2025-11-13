import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";
import { getServiceClient } from "@/lib/supabase/server";

export default async function GettingOutTheDoorPage() {
  const db = getServiceClient();
  const { data: checklists } = await db
    .from("content_items")
    .select("id, title, cover_url, created_at")
    .eq("category", "getting_out_the_door")
    .eq("type", "checklist")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">Getting Out the Door</h1>
        <div className="w-10" />
      </header>
      <main className="pb-20">
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">
            Make mornings smoother. Create checklists with praise phrases to help your child get ready and out the door on time.
          </p>
        </div>

        {/* Getting Out the Door Checklist Shelf */}
        <div className="mt-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Morning Checklist</h2>
              <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] mt-1">
                Create a personalized checklist with reminders of praise phrases to encourage your child.
              </p>
            </div>
          </div>
          
          <div className="relative">
            {/* Horizontal scrollable shelf */}
            <div className="snap-x snap-mandatory overflow-x-auto scroll-p-4 px-4 pb-4 [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-4">
                {/* Create New Card */}
                <Link
                  href="/library/getting-out-the-door/checklist/create"
                  className="snap-center shrink-0 w-64 rounded-xl bg-white dark:bg-[#192730] border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-6 min-h-[280px]"
                >
                  <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                    <span className="material-symbols-outlined text-6xl text-primary">add_circle</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Create New</h3>
                  <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] text-center">
                    Start a new morning checklist
                  </p>
                </Link>

                {/* Previously Created Checklists */}
                {checklists && checklists.length > 0 ? (
                  checklists.map((checklist: any) => (
                    <Link
                      key={checklist.id}
                      href={`/content/${checklist.id}`}
                      className="snap-center shrink-0 w-64 rounded-xl bg-white dark:bg-[#192730] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {checklist.cover_url ? (
                        <img
                          src={checklist.cover_url}
                          alt={checklist.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-5xl text-primary">checklist</span>
                        </div>
                      )}
                      <div className="p-4">
                        <p className="font-medium line-clamp-2 text-sm">{checklist.title}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="snap-center shrink-0 w-64 rounded-xl bg-white dark:bg-[#192730] border border-gray-200 dark:border-gray-800 p-6 flex items-center justify-center min-h-[280px]">
                    <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] text-center">
                      No checklists yet. Create your first one!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <TabBar />
    </>
  );
}

