import { getSiteContent } from "@/lib/content";

const content = getSiteContent();

export default function SchedulePage() {
  return (
    <main className="site-wrap section-wrap">
      <h1 className="section-title">{content.schedule.title}</h1>
      <div className="card-surface mt-8 overflow-x-auto p-6">
        <table className="w-full min-w-[640px] border-collapse text-sm text-sand-700">
          <thead>
            <tr className="border-b border-sand-200 text-left">
              <th className="py-3 pr-4 font-medium text-sand-900">Day</th>
              <th className="py-3 font-medium text-sand-900">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {content.schedule.entries.map((entry) => (
              <tr key={entry.day} className="border-b border-sand-100 align-top">
                <td className="py-3 pr-4 font-medium text-sand-900">{entry.day}</td>
                <td className="py-3">
                  <ul className="space-y-1">
                    {entry.sessions.map((session) => (
                      <li key={session}>{session}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
