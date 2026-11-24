import type { SortKey, StatusFilter, Student } from "../types";
import { currentYearMonth, fullName } from "./format";

export interface StudentSummary {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

export function summarizeStudents(students: Student[], now = new Date()): StudentSummary {
  const month = currentYearMonth(now);
  return {
    total: students.length,
    active: students.filter((student) => student.status === "active").length,
    inactive: students.filter((student) => student.status === "inactive").length,
    newThisMonth: students.filter((student) => student.registrationDate.startsWith(month)).length,
  };
}

export function filterAndSortStudents(
  students: Student[],
  query: string,
  status: StatusFilter,
  sort: SortKey,
): Student[] {
  const needle = query.trim().toLowerCase();

  const filtered = students.filter((student) => {
    if (status !== "all" && student.status !== status) return false;
    if (!needle) return true;
    const haystack = [
      student.id,
      student.firstName,
      student.lastName,
      student.nickname,
      fullName(student.firstName, student.lastName),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  return filtered.sort((left, right) => compareStudents(left, right, sort));
}

function compareStudents(left: Student, right: Student, sort: SortKey): number {
  if (sort === "name-asc" || sort === "name-desc") {
    const byName = fullName(left.firstName, left.lastName).localeCompare(
      fullName(right.firstName, right.lastName),
      "en",
      { sensitivity: "base" },
    );
    return sort === "name-asc" ? byName : -byName;
  }

  const byDate = left.registrationDate.localeCompare(right.registrationDate);
  const byCreated = left.createdAt.localeCompare(right.createdAt);
  const newestFirst = byDate || byCreated || left.id.localeCompare(right.id);
  return sort === "newest" ? -newestFirst : newestFirst;
}
