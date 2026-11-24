import { PanelsTopLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </header>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <EmptyState
          icon={PanelsTopLeft}
          title="Not in this prototype"
          description={description}
          action={
            <Link
              to="/students"
              className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Go to Student Management
            </Link>
          }
        />
      </section>
    </div>
  );
}
