import { getServiceClient } from "@/lib/supabase/server";

export default async function PrintPage({ params }: { params: { id: string } }) {
  const db = getServiceClient();
  const { data } = await db.from("content_items").select("*").eq("id", params.id).single();
  if (!data) return <main className="p-6">Not found</main>;
  return (
    <html lang="en">
      <head>
        <title>Print – {data.title}</title>
        <style>{`
          @media print {
            @page { margin: 12mm; }
            body { color: #111; font-family: serif; }
            .print-actions { display: none; }
          }
          body { background: white; margin: 0; padding: 16px; }
          .container { max-width: 740px; margin: 0 auto; }
          h1 { font-size: 24px; margin: 0 0 12px; }
          .meta { color: #667; font-size: 12px; margin-bottom: 16px; }
          article { background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="print-actions" style={{marginBottom: 12}}>
            <button onClick={() => window.print()} style={{padding: '8px 12px', borderRadius: 999, background: '#13a4ec', color: 'white', border: 0}}>Print</button>
          </div>
          <h1>{data.title}</h1>
          <div className="meta">{String(data.category)} · {String(data.type)}</div>
          <article>
            {data.body?.story_html ? (
              <div dangerouslySetInnerHTML={{ __html: data.body.story_html }} />
            ) : (
              <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(data.body, null, 2)}</pre>
            )}
          </article>
        </div>
      </body>
    </html>
  );
}


