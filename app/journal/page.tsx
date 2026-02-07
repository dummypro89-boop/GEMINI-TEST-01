import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function JournalPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.journal.title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {content.journal.posts.map((post) => (
          <article key={post.title} className="card-surface p-6">
            <p className="text-xs uppercase tracking-[0.08em] text-sand-600">{post.date}</p>
            <h2 className="mt-2 font-serif text-3xl text-sand-900">{post.title}</h2>
            <p className="mt-2 text-sm text-sand-700">{post.summary}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
