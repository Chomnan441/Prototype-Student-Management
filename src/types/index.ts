export type StudentStatus = "active" | "inactive";

export type Role = "admin" | "staff";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  parentName: string;
  phone: string;
  registrationDate: string;
  status: StudentStatus;
  note: string;
  createdAt: string;
}

export type StudentDraft = Omit<Student, "createdAt">;

export interface Course {
  id: string;
  name: string;
  instructor: string;
  subject: string;
}

export type EnrollmentStatus = "active" | "completed";

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  remainingSessions: number;
  status: EnrollmentStatus;
}

export interface EnrollmentDetails extends Enrollment {
  courseName: string;
  instructor: string;
  subject: string;
}

export interface ClassSession {
  id: string;
  studentId: string;
  courseName: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "cancelled";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  courseName: string;
  instructor: string;
  status: AttendanceStatus;
}

export interface StaffUser {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export type StatusFilter = "all" | StudentStatus;

export type SortKey = "newest" | "oldest" | "name-asc" | "name-desc";

export interface StudentFormErrors {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  parentName?: string;
  phone?: string;
  registrationDate?: string;
  note?: string;
}
