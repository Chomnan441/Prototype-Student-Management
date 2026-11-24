import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { findStaffUser, findStaffUserByRole } from "../data/staffUsers";
import { sessionRepository } from "../services/sessionRepository";
import type { Role, StaffUser } from "../types";

interface SessionContextValue {
  user: StaffUser | null;
  signIn: (userId: string) => void;
  signOut: () => void;
  switchRole: (role: Role) => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => sessionRepository.readUserId());

  const value = useMemo<SessionContextValue>(() => {
    return {
      user: userId ? (findStaffUser(userId) ?? null) : null,
      signIn: (nextUserId: string) => {
        if (!findStaffUser(nextUserId)) return;
        sessionRepository.writeUserId(nextUserId);
        setUserId(nextUserId);
      },
      signOut: () => {
        sessionRepository.writeUserId(null);
        setUserId(null);
      },
      switchRole: (role: Role) => {
        const nextUser = findStaffUserByRole(role);
        sessionRepository.writeUserId(nextUser.id);
        setUserId(nextUser.id);
      },
    };
  }, [userId]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within SessionProvider");
  return context;
}
