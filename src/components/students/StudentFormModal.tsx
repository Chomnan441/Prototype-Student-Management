import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { StudentDraft, StudentFormErrors, StudentStatus } from "../../types";
import { todayISO } from "../../utils/format";
import { hasErrors, validateStudentDraft } from "../../utils/validation";

interface StudentFormModalProps {
  mode: "create" | "edit";
  initial: StudentDraft;
  onClose: () => void;
  onSubmit: (draft: StudentDraft) => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30";

export function StudentFormModal({ mode, initial, onClose, onSubmit }: StudentFormModalProps) {
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  const [draft, setDraft] = useState<StudentDraft>(initial);
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("student-first-name")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function update<K extends keyof StudentDraft>(key: K, value: StudentDraft[K]) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    if (submitted) setErrors(validateStudentDraft(next));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateStudentDraft(draft);
    setErrors(nextErrors);
    setSubmitted(true);
    if (hasErrors(nextErrors)) {
      const firstInvalid = ["firstName", "lastName", "nickname", "parentName", "phone", "registrationDate", "note"].find(
        (field) => nextErrors[field as keyof StudentFormErrors],
      );
      if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    onSubmit(draft);
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button type="button" className="absolute inset-0 bg-slate-900/40" aria-label="Close student form" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-slate-900">
              {mode === "create" ? "Add Student" : "Edit Student"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "Create a student record. The student ID is assigned automatically."
                : "Update this student record. The student ID cannot be changed."}
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit} noValidate>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <Field id="student-id" label="Student ID">
              <input id="student-id" className={`${inputClass} h-10 bg-slate-50 text-slate-500`} value={draft.id} readOnly />
            </Field>
            <Field id="student-first-name" label="First Name" required error={errors.firstName}>
              <input
                id="student-first-name"
                className={`${inputClass} h-10`}
                value={draft.firstName}
                onChange={(event) => update("firstName", event.target.value)}
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={errors.firstName ? "student-first-name-error" : undefined}
                autoComplete="off"
              />
            </Field>
            <Field id="student-last-name" label="Last Name" required error={errors.lastName}>
              <input
                id="student-last-name"
                className={`${inputClass} h-10`}
                value={draft.lastName}
                onChange={(event) => update("lastName", event.target.value)}
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={errors.lastName ? "student-last-name-error" : undefined}
                autoComplete="off"
              />
            </Field>
            <Field id="student-nickname" label="Nickname" error={errors.nickname}>
              <input
                id="student-nickname"
                className={`${inputClass} h-10`}
                value={draft.nickname}
                onChange={(event) => update("nickname", event.target.value)}
                aria-invalid={Boolean(errors.nickname)}
                aria-describedby={errors.nickname ? "student-nickname-error" : undefined}
                autoComplete="off"
              />
            </Field>
            <Field id="student-parent" label="Parent Name" error={errors.parentName}>
              <input
                id="student-parent"
                className={`${inputClass} h-10`}
                value={draft.parentName}
                onChange={(event) => update("parentName", event.target.value)}
                aria-invalid={Boolean(errors.parentName)}
                aria-describedby={errors.parentName ? "student-parent-error" : undefined}
                autoComplete="off"
              />
            </Field>
            <Field id="student-phone" label="Phone Number" error={errors.phone}>
              <input
                id="student-phone"
                className={`${inputClass} h-10`}
                value={draft.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="081-234-5678"
                inputMode="tel"
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "student-phone-error" : undefined}
                autoComplete="off"
              />
            </Field>
            <Field id="student-registration-date" label="Registration Date" required error={errors.registrationDate}>
              <input
                id="student-registration-date"
                type="date"
                max={todayISO()}
                className={`${inputClass} h-10`}
                value={draft.registrationDate}
                onChange={(event) => update("registrationDate", event.target.value)}
                aria-invalid={Boolean(errors.registrationDate)}
                aria-describedby={errors.registrationDate ? "student-registration-date-error" : undefined}
              />
            </Field>
            <Field id="student-status" label="Status">
              <select
                id="student-status"
                className={`${inputClass} h-10`}
                value={draft.status}
                onChange={(event) => update("status", event.target.value as StudentStatus)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
            <Field id="student-note" label="Note" error={errors.note}>
              <textarea
                id="student-note"
                rows={4}
                className={`${inputClass} py-2`}
                value={draft.note}
                onChange={(event) => update("note", event.target.value)}
                aria-invalid={Boolean(errors.note)}
                aria-describedby={errors.note ? "student-note-error" : undefined}
              />
            </Field>
          </div>
          <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 px-5 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white outline-none hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Save Student
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  );
}

function fieldId(field: string): string {
  const ids: Record<string, string> = {
    firstName: "student-first-name",
    lastName: "student-last-name",
    nickname: "student-nickname",
    parentName: "student-parent",
    phone: "student-phone",
    registrationDate: "student-registration-date",
    note: "student-note",
  };
  return ids[field] ?? field;
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-rose-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
