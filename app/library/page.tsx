import { TabBar } from "../components/TabBar";
import { CreatePublicGenerate } from "./CreatePublicGenerate";
import { getServiceClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LibraryPage() {
  const db = getServiceClient();
  
  // Fetch previously generated storybooks from new_situations
  const { data: storybooks } = await db
    .from("content_items")
    .select("id, title, cover_url, created_at, body")
    .eq("category", "new_situations")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(20);

  // Filter to only show storybooks (those with pages array)
  const generatedStorybooks = storybooks?.filter((item: any) => 
    item.body?.pages && Array.isArray(item.body.pages)
  ) || [];

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
        
        {/* New Situations Shelf */}
        <div className="relative">
          <div className="snap-x snap-mandatory overflow-x-auto scroll-p-4 px-4 pb-4 [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4">
              {/* Get Started Cards */}
              <a href="/library/new-situations/first-day-of-school/create" className="snap-center shrink-0 w-72 rounded-xl bg-white p-4 dark:bg-[#192730] flex flex-col hover:shadow-md transition-shadow">
                <div className="h-40 rounded-lg bg-primary/10 dark:bg-primary/20 overflow-hidden">
                  <img alt="Illustration of a child going to bed" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjA7AjjsnXMgae2OUFG_g6oelBJXwj6yrYVu2vME4m-mwwmlPh-u3hHuFaMmiRKrCYvZMGmyssDq0ISNApUzhXZs5qbaOCq_KymndGzALTsg79-MPpvG28yODh0M4-5U410RA_tky_y47Ory4Ezjx7LYco2hDMJNxIz4sQUVoOqF4BBE3aVRqJcLx5i-LD6ZoX58KaccUsRGPyne7ZcF-VUXTvdKGqQVCg2-crDnEbPTB4aaarRmnVl3L3bbElGtgMBQm0l7K7xdsB" />
                </div>
                <h3 className="mt-3 text-lg font-bold">First Day of School</h3>
                <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] flex-grow">Help your child prepare for their big day.</p>
                <div className="mt-4 w-full rounded-full bg-primary py-2 text-white text-center">Get Started</div>
              </a>
              <a href="/library/new-situations/doctors-visit/create" className="snap-center shrink-0 w-72 rounded-xl bg-white p-4 dark:bg-[#192730] flex flex-col hover:shadow-md transition-shadow">
                <div className="h-40 rounded-lg bg-primary/10 dark:bg-primary/20 overflow-hidden">
                  <img alt="Illustration of a child at the doctor" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSPbpdPDP9PHeISBHPQliCshVSxHW49eYEUS7VsfreXrFwZk5zmPtxAllw_eNj2bug77q42b2qJBVBnbT_41rdTkhHYxUj56QYh4loYbyVm0cpJN5xc7tTT6oLGd85lBisE5iG8D2sytY2Vm_m5Y28rSKLOIO24apvijl2h-jNA-ol_DqJNGL5YxtHNVhMl0uCK_DmIIqKVCjhxirW3zqPLG_6yoQu4IpFvBNPDX0R0XXRUhYsaCL0vcmgmRhE-FVf9wZ2APXXKSCy" />
                </div>
                <h3 className="mt-3 text-lg font-bold">Doctor's Visit</h3>
                <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] flex-grow">Ease anxiety about medical appointments.</p>
                <div className="mt-4 w-full rounded-full bg-primary py-2 text-white text-center">Get Started</div>
              </a>
              <a href="/library/new-situations/new-sibling/create" className="snap-center shrink-0 w-72 rounded-xl bg-white p-4 dark:bg-[#192730] flex flex-col hover:shadow-md transition-shadow">
                <div className="h-40 rounded-lg bg-primary/10 dark:bg-primary/20 overflow-hidden">
                  <img alt="Illustration of a child getting a new sibling" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQi9Eyi7lwR4LIKrg4p9HUcN2n0balvnwrw-_nbkltMg8sZdOiDcBpyZdzciIx_if4Z-mygjMSZ7Jb-RJkft-2IdLuIjF9_dhTUTnS3d5AE9mEoqfsY2bmbne62GgDrMLm3NRFOzi32WhXyf8r4tJY-UV7-8GliZsiFh7Mh9uEOpigpbrpPYKLgbKgKQ1L-T1_lEAr3MeKauwOqwEuzNAFjhFoBPkuNclnBSWJFwobWG3MSH3WR79eHsDDP_mi8gCobSMS-q6sV-A4" />
                </div>
                <h3 className="mt-3 text-lg font-bold">New Sibling</h3>
                <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] flex-grow">Welcome a new baby to the family.</p>
                <div className="mt-4 w-full rounded-full bg-primary py-2 text-white text-center">Get Started</div>
              </a>

              {/* Previously Generated Storybooks */}
              {generatedStorybooks.map((storybook: any) => (
                <Link
                  key={storybook.id}
                  href={`/content/${storybook.id}`}
                  className="snap-center shrink-0 w-72 rounded-xl bg-white p-4 dark:bg-[#192730] flex flex-col hover:shadow-md transition-shadow"
                >
                  {storybook.cover_url ? (
                    <div className="h-40 rounded-lg overflow-hidden">
                      <img
                        src={storybook.cover_url}
                        alt={storybook.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary">auto_stories</span>
                    </div>
                  )}
                  <div className="flex flex-col flex-grow">
                    <h3 className="mt-3 text-lg font-bold">{storybook.title}</h3>
                    <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] flex-grow">A personalized storybook for your child.</p>
                    <div className="mt-4 w-full rounded-full bg-primary py-2 text-white text-center">View</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <h2 className="px-4 pt-4 pb-3 text-xl font-bold">Categories</h2>
        <div className="space-y-2 px-4">
          {[
            { icon: "dark_mode", label: "Bedtime", items: 12, href: "/library/bedtime" },
            { icon: "directions_car", label: "Getting Out the Door", items: 8, href: "/library/getting-out-the-door" },
            { icon: "check_box", label: "Chores", items: 5, href: "/library/chores" },
            { icon: "grade", label: "Favorites", items: 3, href: "#" },
          ].map((c) => (
            <a key={c.label} href={c.href} className="flex items-center gap-4 rounded-lg bg-white p-3 dark:bg-[#192730]">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                <span className="material-symbols-outlined text-2xl">{c.icon}</span>
              </div>
              <div className="flex-grow">
                <p className="font-medium">{c.label}</p>
                <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">{c.items} items</p>
              </div>
              <span className="material-symbols-outlined text-2xl text-[#617c89] dark:text-[#a0b3bd]">arrow_forward_ios</span>
            </a>
          ))}
        </div>
      </main>
      <TabBar />
    </>
  );
}


