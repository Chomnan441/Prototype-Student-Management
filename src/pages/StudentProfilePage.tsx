import { useState } from "react";
import { ArrowLeft, Pencil, UserX } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StudentAvatar } from "../components/students/StudentAvatar";
import { StudentFormModal } from "../components/students/StudentFormModal";
import { StudentProfileTabs } from "../components/students/StudentProfileTabs";
import { StudentStatusBadge } from "../components/students/StudentStatusBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";
import type { StudentDraft } from "../types";
import { displayValue, fullName } from "../utils/format";

export function StudentProfilePage() {
  const { id } = useParams();
  const { getStudent, updateStudent } = useStudents();
  const { pushToast } = useToast();
  const student = id ? getStudent(id) : undefined;
  const [editing, setEditing] = useState(false);

  if (!student) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <EmptyState
            icon={UserX}
            title="Student not found"
            description="This student ID is not in the current records."
            action={
              <Link
                to="/students"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to Students
              </Link>
            }
          />
        </section>
      </div>
    );
  }

  const draft: StudentDraft = {
    id: student.id,
    firstName: student.firstName,
    lastName: student.lastName,
    nickname: student.nickname,
    parentName: student.parentName,
    phone: student.phone,
    registrationDate: student.registrationDate,
    status: student.status,
    note: student.note,
  };

  function saveProfile(next: StudentDraft) {
    updateStudent(next);
    pushToast(`Updated ${fullName(next.firstName, next.lastName)}.`);
    setEditing(false);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        to="/students"
        className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-600 outline-none hover:text-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Students
      </Link>

      <header className="mt-4 flex flex-col gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <StudentAvatar id={student.id} firstName={student.firstName} lastName={student.lastName} size="lg" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {fullName(student.firstName, student.lastName)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">Nickname: {displayValue(student.nickname)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700">{student.id}</span>
              <StudentStatusBadge status={student.status} />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
          onClick={() => setEditing(true)}
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit Profile
        </button>
      </header>

      <StudentProfileTabs student={student} />

      {editing ? (
        <StudentFormModal
          key={student.id}
          mode="edit"
          initial={draft}
          onClose={() => setEditing(false)}
          onSubmit={saveProfile}
        />
      ) : null}
    </div>
  );
}
