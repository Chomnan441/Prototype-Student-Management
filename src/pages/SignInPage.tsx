import { GraduationCap } from "lucide-react";
import { DEMO_USERS } from "../data/staffUsers";
import { useSession } from "../hooks/useSession";
import { avatarClass, initials } from "../utils/format";
import { cn } from "../utils/cn";

export function SignInPage() {
  const { signIn } = useSession();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">BrightMind Academy</p>
            <p className="text-xs text-slate-500">Internal staff portal</p>
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Choose a demo staff account. There is no public registration and students cannot sign in.
        </p>
        <ul className="mt-6 space-y-3">
          {DEMO_USERS.map((account) => {
            const [first = "", last = ""] = account.name.split(" ");
            return (
              <li key={account.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left outline-none hover:border-indigo-200 hover:bg-indigo-50/40 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  onClick={() => signIn(account.id)}
                >
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold",
                      avatarClass(account.id),
                    )}
                    aria-hidden="true"
                  >
                    {initials(first, last)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{account.name}</span>
                    <span className="block truncate text-xs text-slate-500">{account.email}</span>
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      account.role === "admin" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {account.role === "admin" ? "Admin" : "Staff"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
