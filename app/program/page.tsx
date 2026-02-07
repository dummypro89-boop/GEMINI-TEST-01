import { BookingForm } from "@/components/booking-form";
import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function ProgramPage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.program.title}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.program.steps.map((step) => (
          <article key={step.title} className="card-surface p-6">
            <h2 className="font-serif text-3xl text-sand-900">{step.title}</h2>
            <p className="mt-2 text-sm text-sand-700">{step.description}</p>
          </article>
        ))}
      </div>
      <BookingForm />
    </main>
  );
}
