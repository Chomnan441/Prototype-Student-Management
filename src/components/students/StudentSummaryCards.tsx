import { UserCheck, UserPlus, UserX, Users } from "lucide-react";
import type { Student } from "../../types";
import { summarizeStudents } from "../../utils/students";

export function StudentSummaryCards({ students }: { students: Student[] }) {
  const summary = summarizeStudents(students);
  const cards = [
    { label: "Total Students", value: summary.total, icon: Users, tone: "bg-indigo-50 text-indigo-600" },
    { label: "Active Students", value: summary.active, icon: UserCheck, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Inactive Students", value: summary.inactive, icon: UserX, tone: "bg-slate-100 text-slate-600" },
    { label: "New Students This Month", value: summary.newThisMonth, icon: UserPlus, tone: "bg-sky-50 text-sky-600" },
  ];

  return (
    <section aria-label="Student summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-slate-500">{card.label}</h2>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</p>
              </div>
              <span className={`flex size-10 items-center justify-center rounded-lg ${card.tone}`}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
