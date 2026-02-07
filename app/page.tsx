import Link from "next/link";

import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

const hubs = [
  { title: "About", href: "/about", desc: "브랜드 철학과 수업 기준" },
  { title: "Program", href: "/program", desc: "프로그램 구성과 예약" },
  { title: "Instructors", href: "/instructors", desc: "강사진 소개" },
  { title: "Academy", href: "/academy", desc: "운영 방식과 특징" },
  { title: "Schedule", href: "/schedule", desc: "주간 운영 시간표" },
  { title: "Pricing", href: "/pricing", desc: "수업권 및 패키지" },
  { title: "Journal", href: "/journal", desc: "칼럼 및 매거진" },
  { title: "Contact", href: "/contact", desc: "위치와 문의" }
];

export default function HomePage() {
  return (
    <main className="site-wrap pb-12">
      <section className="section-wrap md:py-28">
        <p className="text-xs uppercase tracking-[0.14em] text-sand-600">{content.hero.eyebrow}</p>
        <h1 className="mt-2 font-serif text-5xl leading-[1.02] text-sand-900 md:text-7xl">
          {content.hero.title}
          <span className="block text-sand-600">{content.hero.highlight}</span>
        </h1>
        <p className="mt-5 max-w-3xl text-sand-700">{content.hero.description}</p>
        <Link href="/program" className="btn-primary mt-7">
          {content.hero.ctaLabel}
        </Link>
      </section>

      <section className="grid gap-4 pb-8 md:grid-cols-2 xl:grid-cols-4">
        {hubs.map((hub) => (
          <Link key={hub.href} href={hub.href} className="card-surface block p-6 transition hover:-translate-y-0.5">
            <h2 className="font-serif text-3xl text-sand-900">{hub.title}</h2>
            <p className="mt-2 text-sm text-sand-700">{hub.desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
