import Link from "next/link";

import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function ContactPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.contact.title}</h1>
      <div className="card-surface mt-8 p-8">
        <ul className="space-y-2 text-sand-700">
          {content.contact.infos.map((item) => (
            <li key={item.label}>
              <span className="inline-block w-20 text-sand-600">{item.label}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
        <Link href={content.contact.ctaHref} className="btn-primary mt-6">
          {content.contact.ctaLabel}
        </Link>
      </div>
    </main>
  );
}
