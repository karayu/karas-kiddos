import Link from "next/link";
import { TabBar } from "@/app/components/TabBar";
import { getServiceClient } from "@/lib/supabase/server";

export default async function ContentPage({ params }: { params: { id: string } }) {
  const db = getServiceClient();
  const { data } = await db.from("content_items").select("*").eq("id", params.id).single();
  if (!data) return <main className="p-6">Not found</main>;
  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark">
        <Link href="/library" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold">{data.title}</h1>
        <div className="w-10" />
      </header>
      <main className="p-4 space-y-4">
        <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">{String(data.category)} · {String(data.type)}</p>
        
        {/* Show generated image for checklists */}
        {data.type === "checklist" && (data.cover_url || data.body?.image_url) && (
          <div className="rounded-lg overflow-hidden bg-white dark:bg-[#192730]">
            <img 
              src={data.cover_url || data.body?.image_url} 
              alt={data.title}
              className="w-full h-auto"
            />
          </div>
        )}
        
        {/* Storybook display */}
        {data.body?.pages && Array.isArray(data.body.pages) ? (
          <div className="space-y-6">
            {data.body.pages.map((page: any, index: number) => (
              <div key={index} className="rounded-xl bg-white dark:bg-[#192730] overflow-hidden shadow-sm">
                {page.imageUrl && (
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800">
                    <img
                      src={page.imageUrl}
                      alt={`Page ${page.pageNumber || index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-sm text-[#617c89] dark:text-[#a0b3bd] mb-2">Page {page.pageNumber || index + 1}</p>
                  <p className="text-base leading-relaxed">{page.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : data.type !== "checklist" ? (
          <article className="prose dark:prose-invert max-w-none bg-white dark:bg-[#192730] p-4 rounded-lg">
            {data.body?.story_html ? (
              <div dangerouslySetInnerHTML={{ __html: data.body.story_html }} />
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data.body, null, 2)}</pre>
            )}
          </article>
        ) : null}
        <div className="flex gap-2">
          <form action={`/api/share/${data.id}`} method="post">
            <button className="rounded-full bg-primary px-4 py-2 text-white">Share</button>
          </form>
          <Link href={`/content/${data.id}/print`} className="rounded-full bg-primary px-4 py-2 text-white">Print</Link>
        </div>
      </main>
      <TabBar />
    </>
  );
}


