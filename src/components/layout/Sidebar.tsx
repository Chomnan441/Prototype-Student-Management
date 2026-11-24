import { useState } from "react";
import { GraduationCap, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../data/navigation";
import { useSession } from "../../hooks/useSession";
import { cn } from "../../utils/cn";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { user, signOut } = useSession();
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-slate-200 bg-white",
          open ? "flex" : "hidden lg:flex",
        )}
        aria-label="Primary"
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-slate-900">BrightMind</span>
            <span className="block truncate text-xs text-slate-500">Staff portal</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to !== "/students"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <p className="truncate px-3 pb-2 text-xs text-slate-500">{user?.email}</p>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={() => setConfirmSignOut(true)}
          >
            <LogOut className="size-4" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmSignOut}
        title="Sign out"
        description="Sign out of the BrightMind staff portal on this browser? You can sign back in with a demo staff account."
        confirmLabel="Sign out"
        tone="danger"
        onCancel={() => setConfirmSignOut(false)}
        onConfirm={() => {
          setConfirmSignOut(false);
          signOut();
        }}
      />
    </>
  );
}
