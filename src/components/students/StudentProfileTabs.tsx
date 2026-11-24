import { useState } from "react";
import type { KeyboardEvent } from "react";
import { CalendarDays, ClipboardList, GraduationCap, History, UserRound } from "lucide-react";
import {
  getAttendance,
  getCourseHistory,
  getCurrentCourses,
  getSchedule,
} from "../../data/academicRecords";
import type { AttendanceStatus, Student } from "../../types";
import { cn } from "../../utils/cn";
import { displayValue, formatDate, formatTimeRange } from "../../utils/format";
import { EmptyState } from "../ui/EmptyState";

type TabId = "overview" | "courses" | "schedule" | "attendance" | "history";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Current Courses" },
  { id: "schedule", label: "Schedule" },
  { id: "attendance", label: "Attendance" },
  { id: "history", label: "Course History" },
];

export function StudentProfileTabs({ student }: { student: Student }) {
  const [active, setActive] = useState<TabId>("overview");
  const courses = getCurrentCourses(student.id);
  const history = getCourseHistory(student.id);
  const schedule = getSchedule(student.id);
  const attendance = getAttendance(student.id);

  const counts: Partial<Record<TabId, number>> = {
    courses: courses.length,
    schedule: schedule.length,
    attendance: attendance.length,
    history: history.length,
  };

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = TABS.findIndex((tab) => tab.id === active);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = TABS[(currentIndex + direction + TABS.length) % TABS.length];
      if (!next) return;
      setActive(next.id);
      document.getElementById(`student-tab-${next.id}`)?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActive(TABS[0].id);
      document.getElementById(`student-tab-${TABS[0].id}`)?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      const last = TABS[TABS.length - 1];
      if (!last) return;
      setActive(last.id);
      document.getElementById(`student-tab-${last.id}`)?.focus();
    }
  }

  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        role="tablist"
        aria-label="Student profile sections"
        className="flex gap-1 overflow-x-auto border-b border-slate-200 px-2"
        onKeyDown={onKeyDown}
      >
        {TABS.map((tab) => {
          const selected = tab.id === active;
          const count = counts[tab.id];
          return (
            <button
              key={tab.id}
              id={`student-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`student-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "shrink-0 border-b-2 px-3 py-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                selected ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800",
              )}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
              {typeof count === "number" ? <span className="ml-1 text-xs text-slate-400">{count}</span> : null}
            </button>
          );
        })}
      </div>

      <div
        id={`student-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`student-tab-${active}`}
        className="p-5"
      >
        {active === "overview" ? <Overview student={student} /> : null}
        {active === "courses" ? (
          courses.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No current courses"
              description="This student is not enrolled in an active course."
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.courseName}
                  instructor={course.instructor}
                  enrollmentDate={course.enrollmentDate}
                  remainingSessions={course.remainingSessions}
                  statusLabel="Active"
                  active
                />
              ))}
            </div>
          )
        ) : null}
        {active === "schedule" ? (
          schedule.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming classes"
              description="There are no scheduled classes for this student."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="py-2 pr-4 font-medium">Date</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Time</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Course</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Instructor</th>
                    <th scope="col" className="py-2 font-medium">Room</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.map((session) => (
                    <tr key={session.id}>
                      <td className="py-3 pr-4 text-slate-700">{formatDate(session.date)}</td>
                      <td className="py-3 pr-4 text-slate-700">{formatTimeRange(session.startTime, session.endTime)}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900">{session.courseName}</td>
                      <td className="py-3 pr-4 text-slate-600">{session.instructor}</td>
                      <td className="py-3 text-slate-600">{session.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
        {active === "attendance" ? (
          attendance.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No attendance records"
              description="Attendance will appear here after the student attends a class."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="py-2 pr-4 font-medium">Date</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Course</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Instructor</th>
                    <th scope="col" className="py-2 font-medium">Attendance status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendance.map((record) => (
                    <tr key={record.id}>
                      <td className="py-3 pr-4 text-slate-700">{formatDate(record.date)}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900">{record.courseName}</td>
                      <td className="py-3 pr-4 text-slate-600">{record.instructor}</td>
                      <td className="py-3">
                        <AttendanceBadge status={record.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : null}
        {active === "history" ? (
          history.length === 0 ? (
            <EmptyState
              icon={History}
              title="No completed courses"
              description="Finished courses will be listed here."
            />
          ) : (
            <div className="grid gap-3 lg:grid-cols-2">
              {history.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.courseName}
                  instructor={course.instructor}
                  enrollmentDate={course.enrollmentDate}
                  remainingSessions={course.remainingSessions}
                  statusLabel="Completed"
                />
              ))}
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}

function Overview({ student }: { student: Student }) {
  const items = [
    { label: "First name", value: student.firstName },
    { label: "Last name", value: student.lastName },
    { label: "Nickname", value: displayValue(student.nickname) },
    { label: "Student ID", value: student.id },
    { label: "Parent name", value: displayValue(student.parentName) },
    { label: "Phone number", value: displayValue(student.phone) },
    { label: "Registration date", value: formatDate(student.registrationDate) },
    { label: "Status", value: student.status === "active" ? "Active" : "Inactive" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
        <UserRound className="size-4" aria-hidden="true" />
        Personal and parent information
      </div>
      <dl className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-200 px-4 py-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{item.value}</dd>
          </div>
        ))}
        <div className="rounded-lg border border-slate-200 px-4 py-3 sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</dt>
          <dd className="mt-1 text-sm leading-6 text-slate-700">
            {student.note.trim() ? student.note : "No notes recorded."}
          </dd>
        </div>
      </dl>
    </div>
  );
}

function CourseCard({
  name,
  instructor,
  enrollmentDate,
  remainingSessions,
  statusLabel,
  active = false,
}: {
  name: string;
  instructor: string;
  enrollmentDate: string;
  remainingSessions: number;
  statusLabel: string;
  active?: boolean;
}) {
  return (
    <article className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900">{name}</h3>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            active ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600",
          )}
        >
          {statusLabel}
        </span>
      </div>
      <dl className="mt-3 space-y-1 text-sm text-slate-600">
        <div className="flex justify-between gap-4">
          <dt>Instructor</dt>
          <dd className="text-right text-slate-900">{instructor}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Enrollment date</dt>
          <dd className="text-slate-900">{formatDate(enrollmentDate)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Remaining sessions</dt>
          <dd className="text-slate-900">{remainingSessions}</dd>
        </div>
      </dl>
    </article>
  );
}

function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const styles: Record<AttendanceStatus, string> = {
    present: "bg-emerald-50 text-emerald-700",
    absent: "bg-rose-50 text-rose-700",
    late: "bg-amber-50 text-amber-800",
    cancelled: "bg-slate-100 text-slate-600",
  };
  const labels: Record<AttendanceStatus, string> = {
    present: "Present",
    absent: "Absent",
    late: "Late",
    cancelled: "Cancelled",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {labels[status]}
    </span>
  );
}
