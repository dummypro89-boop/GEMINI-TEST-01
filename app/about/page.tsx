import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function AboutPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.about.title}</h1>
      <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_1fr]">
        <p className="text-sand-700">{content.about.description}</p>
        <ul className="card-surface m-0 list-disc space-y-2 p-8 pl-10 text-sand-700">
          {content.about.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
