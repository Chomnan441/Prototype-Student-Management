import { Eye, MoreHorizontal, Pencil, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Student } from "../../types";
import { displayValue, formatDate, fullName } from "../../utils/format";
import { Menu, MenuItem } from "../ui/Menu";
import { StudentAvatar } from "./StudentAvatar";
import { StudentStatusBadge } from "./StudentStatusBadge";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onChangeStatus: (student: Student) => void;
}

export function StudentTable({ students, onEdit, onChangeStatus }: StudentTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[920px] w-full border-collapse text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">Student ID</th>
            <th scope="col" className="px-4 py-3 font-medium">Student Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Nickname</th>
            <th scope="col" className="px-4 py-3 font-medium">Parent Name</th>
            <th scope="col" className="px-4 py-3 font-medium">Phone Number</th>
            <th scope="col" className="px-4 py-3 font-medium">Registration Date</th>
            <th scope="col" className="px-4 py-3 font-medium">Status</th>
            <th scope="col" className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => {
            const name = fullName(student.firstName, student.lastName);
            return (
              <tr key={student.id} className="hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">{student.id}</td>
                <td className="px-4 py-3">
                  <Link
                    to={`/students/${student.id}`}
                    className="inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <StudentAvatar id={student.id} firstName={student.firstName} lastName={student.lastName} />
                    <span className="font-medium text-slate-900 hover:text-indigo-700">{name}</span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{displayValue(student.nickname)}</td>
                <td className="px-4 py-3 text-slate-600">{displayValue(student.parentName)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{displayValue(student.phone)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(student.registrationDate)}</td>
                <td className="px-4 py-3">
                  <StudentStatusBadge status={student.status} />
                </td>
                <td className="px-4 py-3">
                  <Menu
                    label={`Actions for ${name}`}
                    trigger={<MoreHorizontal className="size-4" aria-hidden="true" />}
                    triggerClassName="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 outline-none hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <MenuItem
                      icon={<Eye className="size-4" aria-hidden="true" />}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      View Profile
                    </MenuItem>
                    <MenuItem icon={<Pencil className="size-4" aria-hidden="true" />} onClick={() => onEdit(student)}>
                      Edit Student
                    </MenuItem>
                    <MenuItem
                      icon={<RefreshCw className="size-4" aria-hidden="true" />}
                      onClick={() => onChangeStatus(student)}
                    >
                      Change Status
                    </MenuItem>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
