import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import DepartmentPage from "./pages/DepartmentPage";
import CoursePage from "./pages/CoursePage";
import ReportsPage from "./pages/ReportsPage";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/departments" element={<AdminPage />} />
          </Route>

          <Route
            path="/department/:departmentId"
            element={<ProtectedRoute checkDepartment />}
          >
            <Route index element={<DepartmentPage />} />
            <Route path="course/:courseId" element={<CoursePage />} />
          </Route>

          <Route path="/reports" element={<ReportsPage />} />
        </Route>

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
