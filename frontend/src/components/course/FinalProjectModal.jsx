import { useState, useEffect } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";

import { useDepartment } from "../../context/DepartmentContext";
import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = {
  enrollmentId: "",
  title: "",
  description: "",
};

const FinalProjectModal = ({ open, onClose, courseId }) => {
  const { user } = useAuth();

  const {
    finalProjects,
    fetchFinalProjectsByCourse,
    addFinalProject,
    updateFinalProject,
    deleteFinalProject,
    projectLoading,
  } = useDepartment();

  const [mode, setMode] = useState("list"); // list | add | edit
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  /* ================= FETCH WHEN OPEN ================= */
  useEffect(() => {
    if (open && courseId) {
      fetchFinalProjectsByCourse(courseId);
    }
  }, [open, courseId]);

  if (!open) return null;

  /* ================= HANDLERS ================= */

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setMode("add");
  };

  const openEdit = (project) => {
    setEditProject(project);
    setForm({
      enrollmentId: project.enrollmentId || "",
      title: project.title,
      description: project.description,
    });
    setMode("edit");
  };

  const closeForm = () => {
    setEditProject(null);
    setForm(EMPTY_FORM);
    setMode("list");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    await addFinalProject(form.enrollmentId, {
      title: form.title.trim(),
      description: form.description.trim(),
    });

    await fetchFinalProjectsByCourse(courseId);
    closeForm();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    await updateFinalProject(editProject.projectId, {
      title: form.title.trim(),
      description: form.description.trim(),
    });

    await fetchFinalProjectsByCourse(courseId);
    closeForm();
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    await deleteFinalProject(projectId);
    await fetchFinalProjectsByCourse(courseId);
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Final Projects</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {mode === "list" && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2
                             bg-black text-white rounded-md"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              </div>

              {projectLoading ? (
                <p className="text-center text-gray-400 py-10">
                  Loading projects...
                </p>
              ) : finalProjects.length > 0 ? (
                <div className="space-y-4">
                  {finalProjects.map((p) => (
                    <div
                      key={p.projectId}
                      className="border rounded-lg p-4 flex justify-between
                                 hover:bg-gray-50 transition"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {p.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Student: {p.studentName} · Aadhaar: {p.aadhaarNo}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-gray-400 hover:text-black
                                     hover:bg-gray-100 rounded-md"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(p.projectId)}
                          className="p-2 text-gray-400 hover:text-red-600
                                     hover:bg-gray-100 rounded-md"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 py-10">
                  No final projects found
                </p>
              )}
            </>
          )}

          {(mode === "add" || mode === "edit") && (
            <form
              onSubmit={mode === "add" ? handleAddSubmit : handleEditSubmit}
              className="space-y-4"
            >
              {mode === "add" && (
                <input
                  name="enrollmentId"
                  placeholder="Enrollment ID"
                  value={form.enrollmentId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              <input
                name="title"
                placeholder="Project Title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
              />

              <textarea
                name="description"
                placeholder="Project Description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full border rounded-md px-3 py-2"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={projectLoading}
                  className="px-4 py-2 bg-black text-white rounded-md
                             disabled:opacity-50"
                >
                  {mode === "add" ? "Add Project" : "Update Project"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinalProjectModal;
