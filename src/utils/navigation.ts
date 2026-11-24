export interface Crumb {
  label: string;
  to?: string;
}

export function describePath(pathname: string, studentName?: string): { pageName: string; crumbs: Crumb[] } {
  if (pathname === "/students") {
    return {
      pageName: "Student Management",
      crumbs: [
        { label: "Home", to: "/students" },
        { label: "Student Management" },
      ],
    };
  }

  if (pathname.startsWith("/students/")) {
    return {
      pageName: "Student Profile",
      crumbs: [
        { label: "Student Management", to: "/students" },
        { label: studentName || "Student Profile" },
      ],
    };
  }

  const pages: Record<string, string> = {
    "/schedule": "Weekly Schedule",
    "/courses": "Course Management",
    "/availability": "Staff Availability",
    "/receipts": "Receipt Management",
    "/settings": "Settings",
  };

  const pageName = pages[pathname];
  if (pageName) {
    return {
      pageName,
      crumbs: [
        { label: "Home", to: "/students" },
        { label: pageName },
      ],
    };
  }

  return {
    pageName: "Page not found",
    crumbs: [
      { label: "Home", to: "/students" },
      { label: "Page not found" },
    ],
  };
}
