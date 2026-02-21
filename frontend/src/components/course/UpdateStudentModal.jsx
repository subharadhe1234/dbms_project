import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";

import { useDepartment } from "../../context/DepartmentContext";

const UpdateStudentModal = ({ open, onClose, courseId, student }) => {
  const { updateStudent, deleteStudent } = useDepartment();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    name: "",
    aadhaarNo: "",
    dob: null,
    grade: "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        aadhaarNo: student.aadhaarNo || "",
        dob: student.dob ? new Date(student.dob) : null,
        grade: student.grade || "",
      });
    }
    setStatus({ type: "", message: "" });
  }, [student]);

  if (!open || !student) return null;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await updateStudent(courseId, student.id, {
        name: form.name.trim(),
        aadhaarNo: form.aadhaarNo,
        dob: form.dob,
        grade: form.grade,
      });

      if (success) {
        setStatus({ type: "success", message });
      } else {
        setStatus({ type: "error", message });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    setDeleteLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await deleteStudent(courseId, student.id);

      if (success) {
        onClose();
      } else {
        setStatus({ type: "error", message });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Delete failed",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Update Student</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          {status.message && (
            <div
              className={`text-sm px-3 py-2 rounded-md
                ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600"
                    : "bg-green-50 text-green-600"
                }`}
            >
              {status.message}
            </div>
          )}

          <input
            placeholder="Student Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border rounded-md px-3 py-2"
          />

          <input
            placeholder="Aadhaar Number"
            value={form.aadhaarNo}
            onChange={(e) => setForm({ ...form, aadhaarNo: e.target.value })}
            maxLength={12}
            required
            className="w-full border rounded-md px-3 py-2"
          />

          <div>
            <p className="text-sm font-medium mb-1">Date of Birth</p>
            <div className="custom-calendar">
              <Calendar
                value={form.dob}
                onChange={(date) => setForm({ ...form, dob: date })}
                maxDate={new Date()}
              />
            </div>
          </div>

          {/* Grade */}
          <div>
            <p className="text-sm font-medium mb-2">Select Grade</p>

            <div className="flex gap-4">
              {["A", "B", "C", "D", "F"].map((grade) => (
                <div
                  key={grade}
                  onClick={() =>
                    setForm({
                      ...form,
                      grade: form.grade === grade ? null : grade,
                    })
                  }
                  className={`cursor-pointer px-4 py-2 border-2 rounded-xl font-bold transition
                    ${
                      form.grade === grade
                        ? "bg-black text-white border-black"
                        : "bg-white border-gray-300 text-gray-500 hover:border-black"
                    }
                    `}
                >
                  {grade}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentModal;
