import { GraduationCap, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDB } from "../context/DBContext";

export default function Home() {
  const navigate = useNavigate();
  const { setDatabase } = useDB();

  const goToUniversity = async () => {
    await setDatabase("university");
    navigate("/university");
  };

  const goToResearch = async () => {
    await setDatabase("research");
    navigate("/research");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center px-6">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-semibold mb-3 text-center">
        University & Research DB Studio
      </h1>

      <p className="text-neutral-400 mb-14 text-center max-w-xl">
        A Neon-inspired database studio UI built with React and Tailwind
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        {/* University */}
        <button
          onClick={goToUniversity}
          className="group bg-neutral-800 border border-neutral-700 rounded-2xl p-10
                     transition-all duration-200
                     hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20
                     hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center text-center">
            <GraduationCap
              size={80}
              className="text-blue-400 mb-4 group-hover:scale-110 transition"
            />
            <h2 className="text-2xl font-medium">University</h2>
            <p className="text-neutral-400 mt-2">
              Students, courses, departments, instructors
            </p>
          </div>
        </button>

        {/* Research */}
        <button
          onClick={goToResearch}
          className="group bg-neutral-800 border border-neutral-700 rounded-2xl p-10
                     transition-all duration-200
                     hover:border-green-500 hover:shadow-xl hover:shadow-green-500/20
                     hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center text-center">
            <FlaskConical
              size={80}
              className="text-green-400 mb-4 group-hover:scale-110 transition"
            />
            <h2 className="text-2xl font-medium">Research</h2>
            <p className="text-neutral-400 mt-2">
              Labs, researchers, journals, publications
            </p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="mt-16 text-sm text-neutral-500">
        © 2026 · DB Studio UI · React + Tailwind
      </p>
    </div>
  );
}
