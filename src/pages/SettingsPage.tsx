import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useSession } from "../hooks/useSession";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";

export function SettingsPage() {
  const { user } = useSession();
  const { resetDemoData } = useStudents();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);

  function reset() {
    resetDemoData();
    setConfirmReset(false);
    pushToast("Demo student data has been reset.");
    navigate("/students");
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Demo controls for this browser. Accounts and student records are not connected to a server.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Signed-in staff</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</dt>
            <dd className="mt-1 text-sm text-slate-900">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Role</dt>
            <dd className="mt-1 text-sm text-slate-900">{user?.role === "admin" ? "Admin" : "Staff"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
            <dd className="mt-1 text-sm text-slate-900">{user?.email}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Reset Demo Data</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Restore the original student roster in this browser. Students you added or edited will be replaced.
          Course, schedule, and attendance samples stay linked to the original student IDs.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex h-10 items-center rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 outline-none hover:bg-rose-100 focus-visible:ring-2 focus-visible:ring-rose-500"
          onClick={() => setConfirmReset(true)}
        >
          Reset Demo Data
        </button>
      </section>

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data"
        description="This replaces all student records in this browser with the original demo roster. Added and edited students will be lost."
        confirmLabel="Reset data"
        tone="danger"
        onCancel={() => setConfirmReset(false)}
        onConfirm={reset}
      />
    </div>
  );
}
