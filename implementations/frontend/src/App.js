import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// User pages
import UserDashboard      from "./Pages/UserDashboard";
import LoginPage          from "./Pages/LoginPage";
import RegisterPage       from "./Pages/RegisterPage";
import CreateShipmentPage from "./Pages/CreateShipmentPage";
import TrackingPage       from "./Pages/TrackingPage";
import HistoryPage        from "./Pages/HistoryPage";
import PaymentPage        from "./Pages/PaymentPage";
import SettingPage        from "./Pages/SettingPage";

// Admin pages
import AdminLoginPage     from "./Pages/AdminLoginPage";
import AdminDashboardPage from "./Pages/AdminDashboardPage";
import AdminReportsPage   from "./Pages/AdminReportsPage";
import AdminSettingPage   from "./Pages/AdminSettingPage";
import UserApprovalPage   from "./Pages/UserApprovalPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Default ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── User ── */}
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/dashboard"         element={<UserDashboard />} />
        <Route path="/register"          element={<RegisterPage />} />
        <Route path="/create-shipment"   element={<CreateShipmentPage />} />
        <Route path="/tracking"          element={<TrackingPage />} />
        <Route path="/history"           element={<HistoryPage />} />
        <Route path="/payments"          element={<PaymentPage />} />
        <Route path="/settings"          element={<SettingPage />} />

        {/* ── Admin ── */}
        <Route path="/admin/login"       element={<AdminLoginPage />} />
        <Route path="/admin/dashboard"   element={<AdminDashboardPage />} />
        <Route path="/admin/reports"     element={<AdminReportsPage />} />
        <Route path="/admin/settings"    element={<AdminSettingPage />} />
        <Route path="/admin/users"       element={<UserApprovalPage />} />

        {/* ── 404 fallback ── */}
        <Route path="*"                  element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
