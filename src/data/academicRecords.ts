import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassSession,
  Course,
  Enrollment,
  EnrollmentDetails,
} from "../types";
import { addDays } from "../utils/format";

export const COURSES: Course[] = [
  { id: "CRS-01", name: "SAT Math Intensive", instructor: "Aj. Niran Sooksai", subject: "Mathematics" },
  { id: "CRS-02", name: "IELTS Writing Lab", instructor: "Aj. Melissa Grant", subject: "English" },
  { id: "CRS-03", name: "Junior English Conversation", instructor: "Aj. Siriporn Kaewkla", subject: "English" },
  { id: "CRS-04", name: "Physics Grade 10", instructor: "Aj. Wichai Bunma", subject: "Science" },
  { id: "CRS-05", name: "Chemistry O-NET Prep", instructor: "Aj. Daranee Chulasai", subject: "Science" },
  { id: "CRS-06", name: "Coding Fundamentals", instructor: "Aj. Alex Chen", subject: "Technology" },
  { id: "CRS-07", name: "Chinese HSK 3", instructor: "Aj. Lin Mei", subject: "Languages" },
  { id: "CRS-08", name: "Piano Beginner", instructor: "Aj. Kanokwan Deeja", subject: "Music" },
];

const ENROLLMENTS: Enrollment[] = [
  { id: "ENR-001", studentId: "STU-0001", courseId: "CRS-01", enrollmentDate: "2025-06-02", remainingSessions: 8, status: "active" },
  { id: "ENR-002", studentId: "STU-0001", courseId: "CRS-02", enrollmentDate: "2024-06-20", remainingSessions: 0, status: "completed" },
  { id: "ENR-003", studentId: "STU-0002", courseId: "CRS-03", enrollmentDate: "2025-01-10", remainingSessions: 6, status: "active" },
  { id: "ENR-004", studentId: "STU-0003", courseId: "CRS-04", enrollmentDate: "2025-09-01", remainingSessions: 10, status: "active" },
  { id: "ENR-005", studentId: "STU-0003", courseId: "CRS-05", enrollmentDate: "2024-11-04", remainingSessions: 0, status: "completed" },
  { id: "ENR-006", studentId: "STU-0004", courseId: "CRS-06", enrollmentDate: "2026-02-02", remainingSessions: 9, status: "active" },
  { id: "ENR-007", studentId: "STU-0005", courseId: "CRS-07", enrollmentDate: "2026-01-08", remainingSessions: 7, status: "active" },
  { id: "ENR-008", studentId: "STU-0005", courseId: "CRS-08", enrollmentDate: "2025-03-03", remainingSessions: 0, status: "completed" },
  { id: "ENR-009", studentId: "STU-0006", courseId: "CRS-02", enrollmentDate: "2025-02-24", remainingSessions: 0, status: "completed" },
  { id: "ENR-010", studentId: "STU-0007", courseId: "CRS-08", enrollmentDate: "2026-04-06", remainingSessions: 11, status: "active" },
  { id: "ENR-011", studentId: "STU-0007", courseId: "CRS-03", enrollmentDate: "2025-08-11", remainingSessions: 4, status: "active" },
  { id: "ENR-012", studentId: "STU-0008", courseId: "CRS-05", enrollmentDate: "2025-04-14", remainingSessions: 0, status: "completed" },
  { id: "ENR-013", studentId: "STU-0008", courseId: "CRS-01", enrollmentDate: "2024-10-01", remainingSessions: 0, status: "completed" },
  { id: "ENR-014", studentId: "STU-0009", courseId: "CRS-04", enrollmentDate: "2026-03-16", remainingSessions: 5, status: "active" },
  { id: "ENR-015", studentId: "STU-0010", courseId: "CRS-06", enrollmentDate: "2025-06-23", remainingSessions: 0, status: "completed" },
  { id: "ENR-016", studentId: "STU-0011", courseId: "CRS-07", enrollmentDate: "2026-05-04", remainingSessions: 12, status: "active" },
  { id: "ENR-017", studentId: "STU-0012", courseId: "CRS-01", enrollmentDate: "2026-06-15", remainingSessions: 8, status: "active" },
  { id: "ENR-018", studentId: "STU-0012", courseId: "CRS-04", enrollmentDate: "2026-07-01", remainingSessions: 6, status: "active" },
  { id: "ENR-019", studentId: "STU-0014", courseId: "CRS-02", enrollmentDate: "2026-08-03", remainingSessions: 9, status: "active" },
  { id: "ENR-020", studentId: "STU-0016", courseId: "CRS-05", enrollmentDate: "2026-09-14", remainingSessions: 7, status: "active" },
  { id: "ENR-021", studentId: "STU-0018", courseId: "CRS-08", enrollmentDate: "2026-01-26", remainingSessions: 3, status: "active" },
  { id: "ENR-022", studentId: "STU-0019", courseId: "CRS-03", enrollmentDate: "2026-02-20", remainingSessions: 0, status: "completed" },
  { id: "ENR-023", studentId: "STU-0020", courseId: "CRS-06", enrollmentDate: "2026-03-18", remainingSessions: 10, status: "active" },
  { id: "ENR-024", studentId: "STU-0022", courseId: "CRS-01", enrollmentDate: "2026-05-20", remainingSessions: 5, status: "active" },
  { id: "ENR-025", studentId: "STU-0024", courseId: "CRS-02", enrollmentDate: "2026-07-28", remainingSessions: 8, status: "active" },
  { id: "ENR-026", studentId: "STU-0024", courseId: "CRS-07", enrollmentDate: "2025-12-01", remainingSessions: 0, status: "completed" },
  { id: "ENR-027", studentId: "STU-0025", courseId: "CRS-04", enrollmentDate: "2026-08-24", remainingSessions: 6, status: "active" },
  { id: "ENR-028", studentId: "STU-0027", courseId: "CRS-03", enrollmentDate: "2026-11-03", remainingSessions: 12, status: "active" },
  { id: "ENR-029", studentId: "STU-0029", courseId: "CRS-06", enrollmentDate: "2026-11-12", remainingSessions: 12, status: "active" },
  { id: "ENR-030", studentId: "STU-0030", courseId: "CRS-08", enrollmentDate: "2026-11-18", remainingSessions: 12, status: "active" },
];

const COURSE_BY_ID = new Map(COURSES.map((course) => [course.id, course]));

const ATTENDANCE_CYCLE: AttendanceStatus[] = ["present", "present", "late", "absent", "cancelled"];
const RECENT_ATTENDANCE_DATES = ["2026-10-06", "2026-10-20", "2026-11-03", "2026-11-10", "2026-11-17"];
const UPCOMING_DATES = ["2026-11-25", "2026-11-27", "2026-12-02", "2026-12-04", "2026-12-09"];
const TIME_SLOTS = [
  ["16:00", "17:30"],
  ["17:00", "18:30"],
  ["09:00", "10:30"],
  ["13:00", "14:30"],
  ["10:00", "11:30"],
] as const;
const ROOMS = ["Room A1", "Room B2", "Room C3", "Music Studio", "Online"];

function withCourse(enrollment: Enrollment): EnrollmentDetails | undefined {
  const course = COURSE_BY_ID.get(enrollment.courseId);
  if (!course) return undefined;
  return {
    ...enrollment,
    courseName: course.name,
    instructor: course.instructor,
    subject: course.subject,
  };
}

export function getEnrollments(studentId: string): EnrollmentDetails[] {
  return ENROLLMENTS.flatMap((enrollment) => {
    if (enrollment.studentId !== studentId) return [];
    const detailed = withCourse(enrollment);
    return detailed ? [detailed] : [];
  }).sort((left, right) => right.enrollmentDate.localeCompare(left.enrollmentDate));
}

export function getCurrentCourses(studentId: string): EnrollmentDetails[] {
  return getEnrollments(studentId).filter((enrollment) => enrollment.status === "active");
}

export function getCourseHistory(studentId: string): EnrollmentDetails[] {
  return getEnrollments(studentId).filter((enrollment) => enrollment.status === "completed");
}

export function getAttendance(studentId: string): AttendanceRecord[] {
  const enrollments = getEnrollments(studentId);
  const records: AttendanceRecord[] = [];

  enrollments.forEach((enrollment, enrollmentIndex) => {
    RECENT_ATTENDANCE_DATES.forEach((date, dateIndex) => {
      if (date < enrollment.enrollmentDate) return;
      records.push({
        id: `${enrollment.id}-ATT-${dateIndex + 1}`,
        studentId,
        date,
        courseName: enrollment.courseName,
        instructor: enrollment.instructor,
        status: ATTENDANCE_CYCLE[(enrollmentIndex + dateIndex) % ATTENDANCE_CYCLE.length] ?? "present",
      });
    });
  });

  return records.sort((left, right) => right.date.localeCompare(left.date) || left.courseName.localeCompare(right.courseName));
}

export function getSchedule(studentId: string): ClassSession[] {
  const active = getCurrentCourses(studentId);
  const sessions: ClassSession[] = [];

  active.forEach((enrollment, index) => {
    const slot = TIME_SLOTS[index % TIME_SLOTS.length] ?? TIME_SLOTS[0];
    [0, 2].forEach((offset, sessionIndex) => {
      const date = UPCOMING_DATES[(index + offset) % UPCOMING_DATES.length] ?? addDays("2026-11-25", offset * 3);
      sessions.push({
        id: `${enrollment.id}-SCH-${sessionIndex + 1}`,
        studentId,
        courseName: enrollment.courseName,
        instructor: enrollment.instructor,
        date,
        startTime: slot[0],
        endTime: slot[1],
        room: ROOMS[index % ROOMS.length] ?? "Room A1",
      });
    });
  });

  return sessions.sort(
    (left, right) => left.date.localeCompare(right.date) || left.startTime.localeCompare(right.startTime),
  );
}
