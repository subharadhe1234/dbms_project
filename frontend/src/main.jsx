import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DepartmentProvider } from "./context/DepartmentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DepartmentProvider>
        <App />
      </DepartmentProvider>
    </AuthProvider>
  </StrictMode>,
);
