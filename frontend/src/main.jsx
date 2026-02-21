import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";
import { ReportProvider } from "./context/ReportContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
        <DepartmentProvider>
          <ReportProvider>
            <App />
          </ReportProvider>
        </DepartmentProvider>
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
);
