import type { StudentStatus } from "../../types";
import { cn } from "../../utils/cn";

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const active = status === "active";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        active ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" : "bg-slate-100 text-slate-600 ring-slate-500/15",
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
