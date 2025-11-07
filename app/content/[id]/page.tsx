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
        
        <article className="prose dark:prose-invert max-w-none bg-white dark:bg-[#192730] p-4 rounded-lg">
          {data.body?.story_html ? (
            <div dangerouslySetInnerHTML={{ __html: data.body.story_html }} />
          ) : data.type === "checklist" && data.body?.steps ? (
            <div className="space-y-3">
              <h3 className="font-bold text-lg mb-4">{data.body.title || data.title}</h3>
              {data.body.steps.map((step: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                    {step.tip && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.tip}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data.body, null, 2)}</pre>
          )}
        </article>
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


