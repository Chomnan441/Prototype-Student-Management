import { Search, X } from "lucide-react";
import type { SortKey, StatusFilter } from "../../types";

interface StudentToolbarProps {
  query: string;
  status: StatusFilter;
  sort: SortKey;
  matchCount: number;
  totalCount: number;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onSortChange: (value: SortKey) => void;
  onClear: () => void;
}

const fieldClass =
  "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30";

export function StudentToolbar({
  query,
  status,
  sort,
  matchCount,
  totalCount,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onClear,
}: StudentToolbarProps) {
  const filtersActive = query.trim().length > 0 || status !== "all" || sort !== "newest";
  const countLabel =
    query.trim() || status !== "all"
      ? `${matchCount} matching ${matchCount === 1 ? "student" : "students"}`
      : `${totalCount} ${totalCount === 1 ? "student" : "students"}`;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Search and filters">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="student-search" className="mb-1.5 block text-sm font-medium text-slate-700">
            Search
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              id="student-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by ID, first name, last name, or nickname"
              className={`${fieldClass} w-full pl-9`}
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:flex">
          <div>
            <label htmlFor="student-status-filter" className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              id="student-status-filter"
              className={`${fieldClass} w-full lg:w-40`}
              value={status}
              onChange={(event) => onStatusChange(event.target.value as StatusFilter)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="student-sort" className="mb-1.5 block text-sm font-medium text-slate-700">
              Sort by
            </label>
            <select
              id="student-sort"
              className={`${fieldClass} w-full lg:w-40`}
              value={sort}
              onChange={(event) => onSortChange(event.target.value as SortKey)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onClear}
          disabled={!filtersActive}
        >
          <X className="size-4" aria-hidden="true" />
          Clear Filters
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-500" aria-live="polite">
        {countLabel}
      </p>
    </section>
  );
}
