import { TabBar } from "../components/TabBar";
import { CreatePublicGenerate } from "./CreatePublicGenerate";
import { getServiceClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  let items: { id: string; title: string; category: string; type: string }[] | null = null;
  if (hasSupabase) {
    const db = getServiceClient();
    const { data } = await db
      .from("content_items")
      .select("id,title,category,type,created_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(20);
    items = (data as any) ?? [];
  }
  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <div className="w-12" />
        <h1 className="flex-1 text-center text-lg font-bold">Library</h1>
        <CreatePublicGenerate />
      </header>
      <main className="pb-4">
        <div className="px-4 pt-4 pb-3">
          <h2 className="text-xl font-bold">New Situations</h2>
          <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">Personalized stories and schedules</p>
        </div>
        <div className="snap-x snap-mandatory scroll-p-4 overflow-x-auto px-4 pb-4 md:scroll-p-8 [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-4">
            <div className="w-72 shrink-0 snap-center rounded-xl bg-white p-4 dark:bg-[#192730]">
              <div className="flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <img alt="Illustration of a child going to bed" className="h-full w-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjA7AjjsnXMgae2OUFG_g6oelBJXwj6yrYVu2vME4m-mwwmlPh-u3hHuFaMmiRKrCYvZMGmyssDq0ISNApUzhXZs5qbaOCq_KymndGzALTsg79-MPpvG28yODh0M4-5U410RA_tky_y47Ory4Ezjx7LYco2hDMJNxIz4sQUVoOqF4BBE3aVRqJcLx5i-LD6ZoX58KaccUsRGPyne7ZcF-VUXTvdKGqQVCg2-crDnEbPTB4aaarRmnVl3L3bbElGtgMBQm0l7K7xdsB" />
              </div>
              <h3 className="mt-3 text-lg font-bold">First Day of School</h3>
              <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">Help your child prepare for their big day.</p>
              <button className="mt-4 w-full rounded-full bg-primary py-2 text-white">Continue Story</button>
            </div>
            <div className="w-72 shrink-0 snap-center rounded-xl bg-white p-4 dark:bg-[#192730]">
              <div className="flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <img alt="Illustration of a child at the doctor" className="h-full w-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSPbpdPDP9PHeISBHPQliCshVSxHW49eYEUS7VsfreXrFwZk5zmPtxAllw_eNj2bug77q42b2qJBVBnbT_41rdTkhHYxUj56QYh4loYbyVm0cpJN5xc7tTT6oLGd85lBisE5iG8D2sytY2Vm_m5Y28rSKLOIO24apvijl2h-jNA-ol_DqJNGL5YxtHNVhMl0uCK_DmIIqKVCjhxirW3zqPLG_6yoQu4IpFvBNPDX0R0XXRUhYsaCL0vcmgmRhE-FVf9wZ2APXXKSCy" />
              </div>
              <h3 className="mt-3 text-lg font-bold">Doctor's Visit</h3>
              <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">Ease anxiety about medical appointments.</p>
              <button className="mt-4 w-full rounded-full bg-primary py-2 text-white">Explore</button>
            </div>
            <div className="w-72 shrink-0 snap-center rounded-xl bg-white p-4 dark:bg-[#192730]">
              <div className="flex h-40 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <img alt="Illustration of a child getting a new sibling" className="h-full w-full object-cover rounded-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQi9Eyi7lwR4LIKrg4p9HUcN2n0balvnwrw-_nbkltMg8sZdOiDcBpyZdzciIx_if4Z-mygjMSZ7Jb-RJkft-2IdLuIjF9_dhTUTnS3d5AE9mEoqfsY2bmbne62GgDrMLm3NRFOzi32WhXyf8r4tJY-UV7-8GliZsiFh7Mh9uEOpigpbrpPYKLgbKgKQ1L-T1_lEAr3MeKauwOqwEuzNAFjhFoBPkuNclnBSWJFwobWG3MSH3WR79eHsDDP_mi8gCobSMS-q6sV-A4" />
              </div>
              <h3 className="mt-3 text-lg font-bold">New Sibling</h3>
              <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">Welcome a new baby to the family.</p>
              <button className="mt-4 w-full rounded-full bg-primary py-2 text-white">Explore</button>
            </div>
          </div>
        </div>
        <h2 className="px-4 pt-4 pb-3 text-xl font-bold">Categories</h2>
        <div className="space-y-2 px-4">
          {[
            { icon: "dark_mode", label: "Bedtime", items: 12 },
            { icon: "directions_car", label: "Getting Out the Door", items: 8 },
            { icon: "check_box", label: "Chores", items: 5 },
            { icon: "grade", label: "Favorites", items: 3 },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-lg bg-white p-3 dark:bg-[#192730]">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                <span className="material-symbols-outlined text-2xl">{c.icon}</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium">{c.label}</p>
                <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">{c.items} items</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-[#617c89] dark:text-[#a0b3bd]">arrow_forward_ios</span>
            </div>
          ))}
        </div>
      </main>
      <section className="px-4 pb-6">
        <h2 className="text-xl font-bold mb-3">Latest Public Content</h2>
        {!hasSupabase ? (
          <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">Supabase is not configured yet. See setup instructions below.</p>
        ) : (
          <div className="space-y-2">
            {(items ?? []).map((it) => (
              <a key={it.id} href={`/content/${it.id}`} className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-[#192730]">
                <div>
                  <p className="font-medium">{it.title}</p>
                  <p className="text-xs text-[#617c89] dark:text-[#a0b3bd]">{String(it.category)} · {String(it.type)}</p>
                </div>
                <span className="material-symbols-outlined text-2xl text-[#617c89] dark:text-[#a0b3bd]">chevron_right</span>
              </a>
            ))}
          </div>
        )}
      </section>
      {!hasSupabase && (
        <section className="px-4 pb-10">
          <h3 className="font-semibold mb-2">Setup</h3>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-[#617c89] dark:text-[#a0b3bd]">
            <li>Create a Supabase project.</li>
            <li>Add the schema in <code className="bg-black/10 px-1 rounded">supabase/schema.sql</code>.</li>
            <li>Add a <code className="bg-black/10 px-1 rounded">.env.local</code> with your Supabase URL and keys.</li>
            <li>Restart the dev server.</li>
          </ol>
        </section>
      )}
      <TabBar />
    </>
  );
}


