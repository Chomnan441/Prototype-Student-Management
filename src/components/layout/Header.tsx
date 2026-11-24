import { useEffect, useId, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronRight, LogOut, Menu as MenuIcon, Settings } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import { useStudents } from "../../hooks/useStudents";
import type { Role } from "../../types";
import { avatarClass, fullName, initials } from "../../utils/format";
import { describePath } from "../../utils/navigation";
import { cn } from "../../utils/cn";
import { Menu, MenuItem } from "../ui/Menu";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface HeaderProps {
  onOpenSidebar: () => void;
}

interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  to?: string;
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "New registration",
    body: "Itsara Phongphit was registered on 23 Nov 2026.",
    time: "Today",
    unread: true,
    to: "/students/STU-0032",
  },
  {
    id: "n2",
    title: "Status kept on file",
    body: "Hataichanok Rungruang is inactive. The record was not deleted.",
    time: "Yesterday",
    unread: true,
    to: "/students/STU-0031",
  },
  {
    id: "n3",
    title: "Saved in this browser",
    body: "Student changes stay in LocalStorage until demo data is reset.",
    time: "This week",
    unread: false,
  },
];

export function Header({ onOpenSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { user, switchRole, signOut } = useSession();
  const { getStudent } = useStudents();
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const noticePanelId = useId();
  const roleFieldId = useId();

  const student = params.id ? getStudent(params.id) : undefined;
  const studentName = student ? fullName(student.firstName, student.lastName) : undefined;
  const { pageName, crumbs } = describePath(location.pathname, studentName);
  const unreadCount = notices.filter((notice) => notice.unread).length;

  useEffect(() => {
    document.title = `${pageName} · BrightMind Academy`;
  }, [pageName]);

  useEffect(() => {
    setNoticesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!noticesOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (!noticeRef.current?.contains(event.target as Node)) setNoticesOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setNoticesOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [noticesOpen]);

  if (!user) return null;

  function markNotice(id: string) {
    setNotices((current) =>
      current.map((notice) => (notice.id === id ? { ...notice, unread: false } : notice)),
    );
    setNoticesOpen(false);
  }

  function markAllRead() {
    setNotices((current) => current.map((notice) => ({ ...notice, unread: false })));
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <MenuIcon className="size-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-500">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <span key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
                  {index > 0 ? <ChevronRight className="size-3 shrink-0" aria-hidden="true" /> : null}
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="truncate hover:text-indigo-600">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn("truncate", isLast && "text-slate-700")}>{crumb.label}</span>
                  )}
                </span>
              );
            })}
          </nav>
          <p className="truncate text-sm font-semibold text-slate-900">{pageName}</p>
        </div>

        <label className="hidden items-center gap-2 text-xs font-medium text-slate-500 md:flex" htmlFor={roleFieldId}>
          View as
          <select
            id={roleFieldId}
            className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm font-medium text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            value={user.role}
            onChange={(event) => switchRole(event.target.value as Role)}
          >
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>
        </label>

        <div className="relative" ref={noticeRef}>
          <button
            type="button"
            className="relative inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            aria-expanded={noticesOpen}
            aria-controls={noticePanelId}
            onClick={() => setNoticesOpen((open) => !open)}
          >
            <Bell className="size-5" aria-hidden="true" />
            {unreadCount > 0 ? (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-600" aria-hidden="true" />
            ) : null}
          </button>
          {noticesOpen ? (
            <section
              id={noticePanelId}
              className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white shadow-lg"
            >
              <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
                <button
                  type="button"
                  className="text-xs font-medium text-indigo-600 outline-none hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:text-slate-400"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
              </header>
              <ul>
                {notices.map((notice) => (
                  <li key={notice.id} className="border-b border-slate-100 last:border-b-0">
                    {notice.to ? (
                      <Link
                        to={notice.to}
                        className="block px-4 py-3 outline-none hover:bg-slate-50 focus-visible:bg-slate-50"
                        onClick={() => markNotice(notice.id)}
                      >
                        <NoticeBody notice={notice} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="block w-full px-4 py-3 text-left outline-none hover:bg-slate-50 focus-visible:bg-slate-50"
                        onClick={() => markNotice(notice.id)}
                      >
                        <NoticeBody notice={notice} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <Menu
          label="Account menu"
          triggerClassName="inline-flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
          trigger={
            <>
              <span
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-full text-xs font-semibold",
                  avatarClass(user.id),
                )}
                aria-hidden="true"
              >
                {initials(user.name.split(" ")[0] ?? "", user.name.split(" ").slice(-1)[0] ?? "")}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-4 text-slate-900">{user.name}</span>
                <span
                  className={cn(
                    "mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    user.role === "admin" ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {user.role === "admin" ? "Admin" : "Staff"}
                </span>
              </span>
              <ChevronDown className="hidden size-4 text-slate-400 sm:block" aria-hidden="true" />
            </>
          }
        >
          <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role === "admin" ? "Admin" : "Staff"}</p>
          </div>
          <div className="px-3 py-2 md:hidden" onClick={(event) => event.stopPropagation()}>
            <label className="mb-1 block text-xs font-medium text-slate-500" htmlFor={`${roleFieldId}-mobile`}>
              View as
            </label>
            <select
              id={`${roleFieldId}-mobile`}
              className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              value={user.role}
              onChange={(event) => switchRole(event.target.value as Role)}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <MenuItem icon={<Settings className="size-4" aria-hidden="true" />} onClick={() => navigate("/settings")}>
            Settings
          </MenuItem>
          <MenuItem icon={<LogOut className="size-4" aria-hidden="true" />} onClick={() => setConfirmSignOut(true)}>
            Sign out
          </MenuItem>
        </Menu>
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
      </div>
    </header>
  );
}

function NoticeBody({ notice }: { notice: Notice }) {
  return (
    <>
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-900">{notice.title}</span>
        {notice.unread ? <span className="size-2 shrink-0 rounded-full bg-indigo-600" aria-label="Unread" /> : null}
      </span>
      <span className="mt-1 block text-sm leading-5 text-slate-600">{notice.body}</span>
      <span className="mt-1 block text-xs text-slate-400">{notice.time}</span>
    </>
  );
}
