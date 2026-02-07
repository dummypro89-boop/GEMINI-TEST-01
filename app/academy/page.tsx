import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function AcademyPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.academy.title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {content.academy.features.map((item) => (
          <article key={item.title} className="card-surface p-6">
            <h2 className="font-serif text-3xl text-sand-900">{item.title}</h2>
            <p className="mt-2 text-sm text-sand-700">{item.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
