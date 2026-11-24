import type { StaffUser } from "../types";

export const DEMO_USERS: StaffUser[] = [
  {
    id: "admin-1",
    name: "Kittisak Wongchai",
    role: "admin",
    email: "kittisak.wongchai@brightmind.academy",
  },
  {
    id: "staff-1",
    name: "Pimchanok Saelim",
    role: "staff",
    email: "pimchanok.saelim@brightmind.academy",
  },
];

export function findStaffUser(userId: string): StaffUser | undefined {
  return DEMO_USERS.find((user) => user.id === userId);
}

export function findStaffUserByRole(role: StaffUser["role"]): StaffUser {
  const match = DEMO_USERS.find((user) => user.role === role);
  return match ?? DEMO_USERS[0];
}
