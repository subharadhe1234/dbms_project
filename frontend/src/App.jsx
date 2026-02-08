import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Public Pages */
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";

/* Core Pages */
import DepartmentSelector from "./pages/DepartmentSelector";
import DepartmentPage from "./pages/DepartmentPage";
import CoursePage from "./pages/CoursePage";
import ReportsPage from "./pages/ReportsPage";

/* Route Guard */
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ================= PROTECTED ================= */}
        <Route element={<ProtectedRoute />}>
          {/* ADMIN ONLY */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/departments" element={<DepartmentSelector />} />
          </Route>

          {/* DEPARTMENT ROUTE (PARENT) */}
          <Route path="/department/:departmentId" element={<DepartmentPage />}>
            {/* COURSE ROUTE (CHILD) */}
            <Route path="course/:courseId" element={<CoursePage />} />
          </Route>
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-red-600 text-lg">
              Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
