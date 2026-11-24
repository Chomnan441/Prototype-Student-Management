import {
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Receipt,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/schedule",
    label: "Weekly Schedule",
    icon: CalendarDays,
    description: "Weekly class planning will be added in a later release. Student records are available now.",
  },
  {
    to: "/students",
    label: "Student Management",
    icon: GraduationCap,
    description: "Manage student information, enrollment, and student records.",
  },
  {
    to: "/courses",
    label: "Course Management",
    icon: BookOpen,
    description: "Course setup will be added in a later release. Student records are available now.",
  },
  {
    to: "/availability",
    label: "Staff Availability",
    icon: Clock,
    description: "Staff availability will be added in a later release. Student records are available now.",
  },
  {
    to: "/receipts",
    label: "Receipt Management",
    icon: Receipt,
    description: "Receipts will be added in a later release. Student records are available now.",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Demo settings for this browser.",
  },
];
