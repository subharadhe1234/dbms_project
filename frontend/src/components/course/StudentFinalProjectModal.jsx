import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useDepartment } from "../../context/DepartmentContext";

const EMPTY_FORM = {
  title: "",
  description: "",
};

const StudentFinalProjectModal = ({ open, onClose, student }) => {
  const {
    fetchFinalProjectByEnrollmentId,
    addFinalProject,
    updateFinalProject,
    deleteFinalProject,
  } = useDepartment();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [project, setProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH ON OPEN ================= */
  useEffect(() => {
    const loadProject = async () => {
      if (!open || !student?.enrollmentId) return;

      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetchFinalProjectByEnrollmentId(student.enrollmentId);

      if (res?.success && res.data) {
        setProject(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description,
        });
      } else {
        setProject(null);
        setForm(EMPTY_FORM);
      }

      setLoading(false);
    };

    loadProject();
  }, [open, student]);

  if (!open || !student) return null;

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const refreshProject = async () => {
    const refreshed = await fetchFinalProjectByEnrollmentId(
      student.enrollmentId,
    );

    if (refreshed?.success && refreshed.data) {
      setProject(refreshed.data);
      setForm({
        title: refreshed.data.title,
        description: refreshed.data.description,
      });
    } else {
      setProject(null);
      setForm(EMPTY_FORM);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
    };

    if (!payload.title || !payload.description) {
      setError("All fields are required.");
      setSubmitting(false);
      return;
    }

    let res;

    if (project) {
      res = await updateFinalProject(project.projectId, payload);
    } else {
      res = await addFinalProject(student.enrollmentId, payload);
    }

    if (res.success) {
      setSuccess(res.message);
      await refreshProject();
    } else {
      setError(res.message);
    }

    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this final project?")) return;

    setSubmitting(true);
    setError("");
    setSuccess("");

    const res = await deleteFinalProject(project.projectId);

    if (res.success) {
      setSuccess("Project deleted successfully.");
      setProject(null);
      setForm(EMPTY_FORM);
    } else {
      setError(res.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">
            {student.name} - Final Project
          </h2>
          <button onClick={onClose} disabled={submitting}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  {success}
                </div>
              )}

              <input
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full border rounded-md px-3 py-2"
              />

              <textarea
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                disabled={submitting}
                className="w-full border rounded-md px-3 py-2"
              />

              <div className="flex justify-between pt-4">
                {project && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                )}

                <div className="ml-auto flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="px-4 py-2 border rounded-md"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                  >
                    {submitting
                      ? "Processing..."
                      : project
                        ? "Update Project"
                        : "Add Project"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFinalProjectModal;
