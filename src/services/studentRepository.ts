import { SEED_STUDENTS } from "../data/seedStudents";
import type { Student, StudentDraft, StudentStatus } from "../types";
import { normalizePhone } from "../utils/format";

/**
 * Persistence boundary for student records.
 * Screens should go through StudentProvider rather than calling this directly.
 * Swap these LocalStorage methods for Supabase queries when the backend is ready.
 */
const STORAGE_KEY = "ssms.students.v1";

function isStudent(value: unknown): value is Student {
  if (!value || typeof value !== "object") return false;
  const student = value as Partial<Student>;
  return (
    typeof student.id === "string" &&
    typeof student.firstName === "string" &&
    typeof student.lastName === "string" &&
    typeof student.nickname === "string" &&
    typeof student.parentName === "string" &&
    typeof student.phone === "string" &&
    typeof student.registrationDate === "string" &&
    (student.status === "active" || student.status === "inactive") &&
    typeof student.note === "string" &&
    typeof student.createdAt === "string"
  );
}

function cloneSeed(): Student[] {
  return SEED_STUDENTS.map((student) => ({ ...student }));
}

function readStored(): Student[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isStudent)) return null;
  return parsed;
}

export const studentRepository = {
  getAll(): Student[] {
    try {
      const stored = readStored();
      if (stored) return stored;
      const seed = cloneSeed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    } catch {
      return cloneSeed();
    }
  },

  save(students: Student[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  },

  add(students: Student[], draft: StudentDraft): Student[] {
    const created: Student = {
      ...draft,
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      nickname: draft.nickname.trim(),
      parentName: draft.parentName.trim(),
      phone: draft.phone.trim() ? normalizePhone(draft.phone) : "",
      note: draft.note.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [...students, created];
    this.save(next);
    return next;
  },

  update(students: Student[], draft: StudentDraft): Student[] {
    const next = students.map((student) => {
      if (student.id !== draft.id) return student;
      return {
        ...student,
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
        nickname: draft.nickname.trim(),
        parentName: draft.parentName.trim(),
        phone: draft.phone.trim() ? normalizePhone(draft.phone) : "",
        registrationDate: draft.registrationDate,
        status: draft.status,
        note: draft.note.trim(),
      };
    });
    this.save(next);
    return next;
  },

  setStatus(students: Student[], id: string, status: StudentStatus): Student[] {
    const next = students.map((student) => (student.id === id ? { ...student, status } : student));
    this.save(next);
    return next;
  },

  reset(): Student[] {
    const seed = cloneSeed();
    this.save(seed);
    return seed;
  },
};
