import { TabBar } from "@/app/components/TabBar";
import { getServiceClient } from "@/lib/supabase/server";

export default async function SharedPage({ params }: { params: { token: string } }) {
  const db = getServiceClient();
  const { data: share } = await db.from("shares").select("*, content:content_items(*)").eq("token", params.token).single();
  if (!share) return <main className="p-6">Not found</main>;
  const content = (share as any).content;
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">{content.title}</h1>
      <p className="text-sm text-[#617c89] dark:text-[#a0b3bd]">{String(content.category)} · {String(content.type)}</p>
      <article className="prose dark:prose-invert max-w-none bg-white dark:bg-[#192730] p-4 rounded-lg">
        {content.body?.story_html ? (
          <div dangerouslySetInnerHTML={{ __html: content.body.story_html }} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(content.body, null, 2)}</pre>
        )}
      </article>
      <div className="flex gap-2">
        <form action={`/content/${content.id}/print`}>
          <button className="rounded-full bg-primary px-4 py-2 text-white">Print</button>
        </form>
      </div>
      <TabBar />
    </main>
  );
}


