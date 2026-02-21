import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { useDepartment } from "../../context/DepartmentContext";

const EditCourseModal = ({ open, course, departmentId, onClose }) => {
  const { subjectAreas, updateCourse, fetchCoursesByDepartment } =
    useDepartment();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    title: "",
    year: "",
    duration: "",
    syllabus: "",
    subjectAreas: [],
  });

  /* ================= PREFILL DATA ================= */
  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        year: course.year || "",
        duration: course.duration || "",
        syllabus: course.syllabus || "",
        subjectAreas: course.subjectAreas || [],
      });
    }
  }, [course]);

  if (!open || !course) return null;

  /* ================= RESET ================= */
  const resetState = () => {
    setStatus({ type: "", message: "" });
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  /* ================= SUBJECT TOGGLE ================= */
  const toggleSubject = (name) => {
    const exists = form.subjectAreas.includes(name);

    setForm({
      ...form,
      subjectAreas: exists
        ? form.subjectAreas.filter((s) => s !== name)
        : [...form.subjectAreas, name],
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await updateCourse(departmentId, course.id, {
        title: form.title.trim(),
        year: Number(form.year),
        duration: Number(form.duration),
        syllabus: form.syllabus.trim(),
        subjectAreas: form.subjectAreas,
      });

      if (success) {
        setStatus({ type: "success", message });

        fetchCoursesByDepartment(departmentId);
      } else {
        setStatus({ type: "error", message });
      }
    } catch (error) {
      console.log(error);
      setStatus({
        type: "error",
        message: error.message || "Failed to update course",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg border overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold">Edit Course</h2>
            <p className="text-xs text-gray-500">Updating: {course.title}</p>
          </div>
          <button onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* STATUS */}
          {status.message && (
            <div
              className={`text-sm px-3 py-2 rounded-md
                ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }`}
            >
              {status.message}
            </div>
          )}

          {/* TITLE */}
          <div>
            <label className="text-sm font-semibold mb-1 block">
              Course Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-black"
            />
          </div>

          {/* YEAR & DURATION */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
              className="border rounded-md px-3 py-2 focus:ring-1 focus:ring-black"
            />

            <input
              type="number"
              placeholder="Duration (months)"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
              className="border rounded-md px-3 py-2 focus:ring-1 focus:ring-black"
            />
          </div>

          {/* SYLLABUS */}
          <textarea
            rows={4}
            placeholder="Syllabus details..."
            value={form.syllabus}
            onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
            required
            className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-black resize-none"
          />

          {/* SUBJECT AREAS */}
          <div>
            <p className="text-sm font-semibold mb-2">Subject Areas</p>

            {subjectAreas?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjectAreas.map((s, idx) => {
                  const name = typeof s === "object" ? s.name : s;

                  const selected = form.subjectAreas.includes(name);

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => toggleSubject(name)}
                      className={`px-4 py-1.5 rounded-full text-sm border transition
                        ${
                          selected
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-600 border-gray-300 hover:border-black"
                        }
                      `}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No subject areas available
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-md flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Updating..."
              ) : (
                <>
                  <Save size={16} />
                  Update Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
