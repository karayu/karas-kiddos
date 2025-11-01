import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kara's Kiddos</h1>
      <p className="text-sm mb-6">Less Chaos. More Magic.</p>
      <div className="space-x-3">
        <Link href="/library" className="underline text-primary">Go to Library</Link>
        <Link href="/engagement" className="underline text-primary">Engagement</Link>
        <Link href="/profile" className="underline text-primary">Profile</Link>
      </div>
    </main>
  );
}


