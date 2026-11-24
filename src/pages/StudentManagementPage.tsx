import { useEffect, useMemo, useState } from "react";
import { Plus, SearchX, Users } from "lucide-react";
import { StudentFormModal } from "../components/students/StudentFormModal";
import { StudentSummaryCards } from "../components/students/StudentSummaryCards";
import { StudentTable } from "../components/students/StudentTable";
import { StudentToolbar } from "../components/students/StudentToolbar";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { Pagination } from "../components/ui/Pagination";
import { useStudents } from "../hooks/useStudents";
import { useToast } from "../hooks/useToast";
import type { SortKey, StatusFilter, Student, StudentDraft } from "../types";
import { fullName, nextStudentId, todayISO } from "../utils/format";
import { filterAndSortStudents } from "../utils/students";

export function StudentManagementPage() {
  const { students, addStudent, updateStudent, setStudentStatus } = useStudents();
  const { pushToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState<{ mode: "create" | "edit"; draft: StudentDraft } | null>(null);
  const [statusTarget, setStatusTarget] = useState<Student | null>(null);

  const filtered = useMemo(
    () => filterAndSortStudents(students, query, status, sort),
    [students, query, status, sort],
  );

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [filtered.length, page, pageSize]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const nextStatus = statusTarget?.status === "active" ? "inactive" : "active";

  function openCreate() {
    setForm({
      mode: "create",
      draft: {
        id: nextStudentId(students.map((student) => student.id)),
        firstName: "",
        lastName: "",
        nickname: "",
        parentName: "",
        phone: "",
        registrationDate: todayISO(),
        status: "active",
        note: "",
      },
    });
  }

  function openEdit(student: Student) {
    setForm({
      mode: "edit",
      draft: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        nickname: student.nickname,
        parentName: student.parentName,
        phone: student.phone,
        registrationDate: student.registrationDate,
        status: student.status,
        note: student.note,
      },
    });
  }

  function saveStudent(draft: StudentDraft) {
    if (!form) return;
    if (form.mode === "create") {
      const created = addStudent(draft);
      pushToast(`Added ${fullName(created.firstName, created.lastName)} (${created.id}).`);
      setSort("newest");
      setPage(1);
    } else {
      updateStudent(draft);
      pushToast(`Updated ${fullName(draft.firstName, draft.lastName)}.`);
    }
    setForm(null);
  }

  function confirmStatusChange() {
    if (!statusTarget) return;
    setStudentStatus(statusTarget.id, nextStatus);
    pushToast(
      `Marked ${fullName(statusTarget.firstName, statusTarget.lastName)} as ${nextStatus === "active" ? "Active" : "Inactive"}.`,
    );
    setStatusTarget(null);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Student Management</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage student information, enrollment, and student records.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          onClick={openCreate}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Student
        </button>
      </header>

      <StudentSummaryCards students={students} />

      <StudentToolbar
        query={query}
        status={status}
        sort={sort}
        matchCount={filtered.length}
        totalCount={students.length}
        onQueryChange={(value) => {
          setQuery(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onClear={() => {
          setQuery("");
          setStatus("all");
          setSort("newest");
          setPage(1);
        }}
      />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students yet"
            description="Add the first student record to start the roster."
            action={
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={openCreate}
              >
                <Plus className="size-4" aria-hidden="true" />
                Add Student
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No students match"
            description="Try a different name, nickname, student ID, or status."
            action={
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setSort("newest");
                  setPage(1);
                }}
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <>
            <StudentTable students={pageRows} onEdit={openEdit} onChangeStatus={setStatusTarget} />
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </section>

      {form ? (
        <StudentFormModal
          key={`${form.mode}-${form.draft.id}`}
          mode={form.mode}
          initial={form.draft}
          onClose={() => setForm(null)}
          onSubmit={saveStudent}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title="Change student status"
        description={
          statusTarget
            ? `Change ${fullName(statusTarget.firstName, statusTarget.lastName)} (${statusTarget.id}) from ${statusTarget.status === "active" ? "Active" : "Inactive"} to ${nextStatus === "active" ? "Active" : "Inactive"}? The student record will be kept.`
            : ""
        }
        confirmLabel={nextStatus === "active" ? "Mark as Active" : "Mark as Inactive"}
        onCancel={() => setStatusTarget(null)}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
}
