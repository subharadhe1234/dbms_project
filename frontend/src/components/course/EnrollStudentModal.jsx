import { useState } from "react";
import { X, Search } from "lucide-react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../index.css";

import { useDepartment } from "../../context/DepartmentContext";
import { getStudentByAadhaar } from "../../api/departmentApi";

const EnrollStudentModal = ({ open, onClose, courseId }) => {
  const { enrollExistingStudent, enrollNewStudent } = useDepartment();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [form, setForm] = useState({
    name: "",
    aadhaarNo: "",
    dob: null,
    grade: null,
  });

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearching(true);
    setStatus({ type: "", message: "" });
    setResult(null);

    try {
      const res = await getStudentByAadhaar(courseId, query);

      setResult(res.data.data);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 404) {
          setResult(null);
          setStatus({
            type: "info",
            message: "Student not found. You can add new student below.",
          });
        } else if (status === 409) {
          // Already enrolled
          setResult(null);
          setStatus({
            type: "error",
            message: "Student is already enrolled in this course.",
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
          message: "Network error. Please try again.",
        });
      }
    } finally {
      setSearching(false);
    }
  };

  const handleEnrollExisting = async (studentId) => {
    setLoading(true);
    // setStatus({ type: "", message: "" });
    try {
      const { success, message } = await enrollExistingStudent(courseId, {
        studentId,
        grade: form.grade,
      });

      if (success) {
        setStatus({
          type: "success",
          message: message,
        });

        setForm({
          name: "",
          aadhaarNo: "",
          dob: null,
          grade: null,
        });

        setQuery("");
        setResult(null);
      } else {
        setStatus({
          type: "error",
          message: message,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to enroll student. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setStatus({ type: "", message: "" });

    try {
      const { success, message } = await enrollNewStudent(courseId, {
        name: form.name.trim(),
        aadhaarNo: query,
        dob: form.dob,
        grade: form.grade,
      });

      if (success) {
        setStatus({
          type: "success",
          message: message,
        });

        setForm({
          name: "",
          aadhaarNo: "",
          dob: null,
          grade: null,
        });

        setQuery("");
        setResult(null);
      } else {
        setStatus({
          type: "error",
          message: message,
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to enroll student. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  const setClose = () => {
    setQuery("");
    setResult(null);
    setStatus({ type: "", message: "" });
    setForm({
      name: "",
      aadhaarNo: "",
      dob: null,
      grade: null,
    });
    onClose();
  };
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white w-full max-w-xl rounded-xl shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Enroll Student</h2>
            <button onClick={setClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Aadhaar Search Section */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Enter Aadhaar Number</p>

              <div className="flex gap-3">
                <input
                  value={query}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^[0-9\b]+$/.test(value)) {
                      setQuery(value);
                      setStatus({ type: "", message: "" });
                      setResult(null);
                      setForm({
                        name: "",
                        aadhaarNo: "",
                        dob: null,
                        grade: null,
                      });
                    }
                  }}
                  placeholder="Enter 12-digit Aadhaar"
                  maxLength={12}
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

            {/* Searching */}
            {searching && <p className="text-sm text-gray-400">Searching...</p>}

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
            {!searching && result && (
              <>
                <div className="border rounded-md p-4 bg-gray-50 space-y-1">
                  <p className="font-medium text-base">{result.name}</p>

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

                <button
                  onClick={() => handleEnrollExisting(result.id)}
                  className="w-full py-2 bg-black text-white rounded-md"
                >
                  {loading ? "Enrolling..." : "Enroll Student"}
                </button>
              </>
            )}

            {/* If Not Found */}
            {!searching && query && !result && status.type === "info" && (
              <>
                <form onSubmit={handleAddNew} className="space-y-4">
                  <input
                    placeholder="Student Name"
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

                  <button
                    type="submit"
                    className="w-full py-2 bg-black text-white rounded-md"
                  >
                    {loading ? "Adding..." : "Add & Enroll"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollStudentModal;
