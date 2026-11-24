import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { studentRepository } from "../services/studentRepository";
import type { Student, StudentDraft, StudentStatus } from "../types";

interface StudentContextValue {
  students: Student[];
  addStudent: (draft: StudentDraft) => Student;
  updateStudent: (draft: StudentDraft) => void;
  setStudentStatus: (id: string, status: StudentStatus) => void;
  resetDemoData: () => void;
  getStudent: (id: string) => Student | undefined;
}

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(() => studentRepository.getAll());

  const value = useMemo<StudentContextValue>(() => {
    return {
      students,
      addStudent: (draft) => {
        const next = studentRepository.add(students, draft);
        setStudents(next);
        const created = next.find((student) => student.id === draft.id);
        if (!created) throw new Error("Student was not saved.");
        return created;
      },
      updateStudent: (draft) => {
        setStudents(studentRepository.update(students, draft));
      },
      setStudentStatus: (id, status) => {
        setStudents(studentRepository.setStatus(students, id, status));
      },
      resetDemoData: () => {
        setStudents(studentRepository.reset());
      },
      getStudent: (id) => students.find((student) => student.id === id),
    };
  }, [students]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudents(): StudentContextValue {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudents must be used within StudentProvider");
  return context;
}
