import { useEffect } from "react";
import { X } from "lucide-react";

import { useDepartment } from "../../context/DepartmentContext";

const FinalProjectModal = ({ open, onClose, courseId }) => {
  const { finalProjects, fetchFinalProjectsByCourse, projectLoading } =
    useDepartment();

  /* ================= FETCH WHEN OPEN ================= */
  useEffect(() => {
    if (open && courseId) {
      fetchFinalProjectsByCourse(courseId);
    }
  }, [open, courseId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Final Projects</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {projectLoading ? (
            <p className="text-center text-gray-400 py-10">
              Loading projects...
            </p>
          ) : finalProjects.length > 0 ? (
            <div className="space-y-4">
              {finalProjects.map((p) => (
                <div
                  key={p.projectId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-900">{p.title}</h3>

                  <p className="text-sm text-gray-600 mt-1">{p.description}</p>

                  <p className="text-xs text-gray-500 mt-2">
                    Student: {p.studentName} · Aadhaar: {p.aadhaarNo}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-10">
              No final projects found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalProjectModal;
