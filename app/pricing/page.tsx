import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function PricingPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.pricing.title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.pricing.plans.map((plan) => (
          <article key={plan.name} className="card-surface p-6">
            <h2 className="font-serif text-3xl text-sand-900">{plan.name}</h2>
            <p className="mt-3 text-sand-900">{plan.price}</p>
            <p className="mt-2 text-sm text-sand-700">{plan.note}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
