import { findStaffUser } from "../data/staffUsers";

/** Demo session only. Replace with real staff authentication later. */
const STORAGE_KEY = "ssms.session.v1";
const SIGNED_OUT = "signed-out";
const DEFAULT_USER_ID = "admin-1";

export const sessionRepository = {
  readUserId(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return DEFAULT_USER_ID;
      if (raw === SIGNED_OUT) return null;
      return findStaffUser(raw) ? raw : DEFAULT_USER_ID;
    } catch {
      return DEFAULT_USER_ID;
    }
  },

  writeUserId(userId: string | null): void {
    localStorage.setItem(STORAGE_KEY, userId ?? SIGNED_OUT);
  },
};
