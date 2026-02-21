import { useState } from "react";
import { X, Search } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";

import { useDepartment } from "../../context/DepartmentContext";
import { getInstructorByAadhaar } from "../../api/departmentApi";

const AssignInstructorModal = ({ open, onClose, courseId }) => {
  const { assignExistingInstructor, assignNewInstructor } = useDepartment();

  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    name: "",
    dob: null,
  });

  if (!open) return null;

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setStatus({ type: "", message: "" });
    setResult(null);

    try {
      const res = await getInstructorByAadhaar(courseId, query);
      setResult(res.data.data);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 404) {
          setStatus({
            type: "info",
            message: "Instructor not found. Add new instructor below.",
          });
        } else if (status === 409) {
          setStatus({
            type: "error",
            message: "Instructor already assigned to this course.",
          });
        } else {
          setStatus({
            type: "error",
            message: data.message || "Something went wrong",
          });
        }
      } else {
        setStatus({
          type: "error",
          message: "Network error",
        });
      }
    } finally {
      setSearching(false);
    }
  };

  /* ================= ASSIGN EXISTING ================= */
  const handleAssignExisting = async (instructorId) => {
    setLoading(true);

    try {
      const { success, message } = await assignExistingInstructor(courseId, {
        instructorId,
      });

      if (success) {
        setStatus({ type: "success", message });
        resetAndClose();
      } else {
        setStatus({ type: "error", message });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to assign instructor",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD NEW ================= */
  const handleAddNew = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, message } = await assignNewInstructor(courseId, {
        name: form.name.trim(),
        aadhaarNo: query,
        dob: form.dob,
      });

      if (success) {
        setStatus({ type: "success", message });
        resetAndClose();
      } else {
        setStatus({ type: "error", message });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to add instructor",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setQuery("");
    setResult(null);
    setForm({ name: "", dob: null });
    setStatus({ type: "", message: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Assign Instructor</h2>
          <button onClick={resetAndClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Aadhaar */}
          <div>
            <p className="text-sm font-semibold mb-2">Enter Aadhaar Number</p>

            <div className="flex gap-3">
              <input
                value={query}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^[0-9\b]+$/.test(value)) {
                    setQuery(value);
                    setStatus({ type: "", message: "" });
                    setResult(null);
                  }
                }}
                maxLength={12}
                placeholder="Enter 12-digit Aadhaar"
                className="flex-1 border rounded-md px-3 py-2"
              />

              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-black text-white rounded-md"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {searching && <p className="text-sm text-gray-400">Searching...</p>}

          {/* Status */}
          {status.message && (
            <div
              className={`text-sm px-3 py-2 rounded-md
                ${
                  status.type === "error"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : status.type === "success"
                      ? "bg-green-50 text-green-600 border border-green-200"
                      : "bg-yellow-50 text-yellow-600 border border-yellow-200"
                }
              `}
            >
              {status.message}
            </div>
          )}

          {/* If Found */}
          {result && (
            <>
              <div className="border rounded-md p-4 bg-gray-50 space-y-1">
                <p className="font-medium">{result.name}</p>
                <p className="text-xs text-gray-500">
                  Aadhaar: {result.aadhaarNo}
                </p>
                <p className="text-xs text-gray-500">
                  DOB:{" "}
                  {result.dob
                    ? new Date(result.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <button
                onClick={() => handleAssignExisting(result.id)}
                className="w-full py-2 bg-black text-white rounded-md"
              >
                {loading ? "Assigning..." : "Assign Instructor"}
              </button>
            </>
          )}

          {/* If Not Found */}
          {!result && status.type === "info" && (
            <form onSubmit={handleAddNew} className="space-y-4">
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

              <button
                type="submit"
                className="w-full py-2 bg-black text-white rounded-md"
              >
                {loading ? "Adding..." : "Add & Assign"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignInstructorModal;
