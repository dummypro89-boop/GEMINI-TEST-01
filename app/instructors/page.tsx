import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function InstructorsPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">Instructors</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.teacher.instructors.map((item) => (
          <article key={item.name} className="card-surface p-6">
            <h2 className="font-serif text-3xl text-sand-900">{item.name}</h2>
            <p className="mt-2 text-sm text-sand-700">{item.bio}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
