import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";

import { useDepartment } from "../../context/DepartmentContext";

const UpdateInstructorModal = ({ open, onClose, courseId, instructor }) => {
  const { updateInstructor, deleteInstructor } = useDepartment();

  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    aadhaarNo: "",
    dob: null,
  });

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (instructor) {
      setForm({
        name: instructor.name || "",
        aadhaarNo: instructor.aadhaarNo || "",
        dob: instructor.dob ? new Date(instructor.dob) : null,
      });
    }
    setStatus({ type: "", message: "" });
  }, [instructor]);

  if (!open || !instructor) return null;

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await updateInstructor(
        courseId,
        instructor.id,
        {
          name: form.name.trim(),
          aadhaarNo: form.aadhaarNo,
          dob: form.dob,
        },
      );

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

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to remove this instructor from the course?",
      )
    )
      return;

    setDeleteLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const { success, message } = await deleteInstructor(
        courseId,
        instructor.id,
      );

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
          <h2 className="text-lg font-semibold">Update Instructor</h2>
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
                }
              `}
            >
              {status.message}
            </div>
          )}

          <input
            placeholder="Instructor Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
            className="w-full border rounded-md px-3 py-2"
          />

          <input
            placeholder="Aadhaar Number"
            value={form.aadhaarNo}
            onChange={(e) =>
              setForm({
                ...form,
                aadhaarNo: e.target.value,
              })
            }
            maxLength={12}
            required
            className="w-full border rounded-md px-3 py-2"
          />

          <div>
            <p className="text-sm font-medium mb-1">Date of Birth</p>
            <div className="custom-calendar">
              <Calendar
                value={form.dob}
                onChange={(date) =>
                  setForm({
                    ...form,
                    dob: date,
                  })
                }
                maxDate={new Date()}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              {deleteLoading ? "Removing..." : "Remove"}
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

export default UpdateInstructorModal;
