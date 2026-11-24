import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { SessionProvider } from "./context/SessionContext";
import { StudentProvider } from "./context/StudentContext";
import { ToastProvider } from "./context/ToastContext";
import { useSession } from "./hooks/useSession";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SignInPage } from "./pages/SignInPage";
import { StudentManagementPage } from "./pages/StudentManagementPage";
import { StudentProfilePage } from "./pages/StudentProfilePage";
import { NAV_ITEMS } from "./data/navigation";

function AppRoutes() {
  const { user } = useSession();
  if (!user) return <SignInPage />;

  const placeholders = NAV_ITEMS.filter((item) => item.to !== "/students" && item.to !== "/settings");

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="students/:id" element={<StudentProfilePage />} />
        {placeholders.map((item) => (
          <Route
            key={item.to}
            path={item.to.slice(1)}
            element={<PlaceholderPage title={item.label} description={item.description} />}
          />
        ))}
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page not found"
              description="That page is not part of the staff portal."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SessionProvider>
          <StudentProvider>
            <AppRoutes />
          </StudentProvider>
        </SessionProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
