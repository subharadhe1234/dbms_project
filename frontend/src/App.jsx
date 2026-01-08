import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import UniversityDashboard from "./pages/university/UniversityDashboard";
import ResearchDashboard from "./pages/research/ResearchDashboard";
import ErrorToast from "./components/ErrorToast";

export default function App() {
  return (
    <>
      <ErrorToast />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/university/*" element={<UniversityDashboard />} />

          <Route path="/research/*" element={<ResearchDashboard />} />

          {/* FALLBACK */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center text-red-600">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
