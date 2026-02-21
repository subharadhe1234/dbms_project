import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Users, GraduationCap, Plus, FolderOpen } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useDepartment } from "../context/DepartmentContext";

import EnrollStudentModal from "../components/course/EnrollStudentModal";
import UpdateStudentModal from "../components/course/UpdateStudentModal";
import AssignInstructorModal from "../components/course/AssignInstructorModal";
import UpdateInstructorModal from "../components/course/UpdateInstructorModal";
import FinalProjectModal from "../components/course/FinalProjectModal";

const CoursePage = () => {
  const { departmentId, courseId } = useParams();
  const [studentSearch, setStudentSearch] = useState("");

  const [showSyllabusModal, setShowSyllabusModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showUpdateInstructorModal, setShowUpdateInstructorModal] =
    useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const {
    courses,
    instructors,
    students,
    studentLoading,
    studentHasMore,
    instructorLoading,
    fetchStudentsByCourse,
    searchStudentsInCourse,
    fetchInstructorsByCourse,
    fetchFinalProjectsByCourse,
    fetchCoursesByDepartment,
  } = useDepartment();

  /* ================= LOAD COURSE ================= */
  useEffect(() => {
    fetchCoursesByDepartment(departmentId);
  }, [departmentId]);

  const course = courses.find((c) => String(c.id) === courseId);

  /* ================= LOAD STUDENTS ================= */
  useEffect(() => {
    if (courseId) {
      fetchStudentsByCourse(courseId, true);
    }
  }, [courseId, showStudentModal, showUpdateStudentModal]);

  /* ================= LOAD INSTRUCTORS ================= */
  useEffect(() => {
    if (courseId) {
      fetchInstructorsByCourse(courseId);
    }
  }, [courseId, showInstructorModal, showUpdateInstructorModal]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar active="home" />
        <div className="flex-1 pt-32 text-center text-gray-500">
          Course not found
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar active="home" />

      <main className="flex-1 pt-28 px-6 max-w-6xl mx-auto space-y-10 w-full">
        {/* ================= HEADER ================= */}
        <header className="border border-gray-200 rounded-xl p-6 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="mt-2 text-sm text-gray-500">
                Year {course.year} · {course.duration} months
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.subjectAreas?.map((s, idx) => {
                  const name = typeof s === "string" ? s : s.name;
                  return (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs uppercase border rounded bg-gray-50"
                    >
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              {/* Syllabus Button */}
              <button
                onClick={() => setShowSyllabusModal(true)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-black hover:text-white transition"
              >
                Show Syllabus
              </button>

              {/* Project Button */}
              <div className="relative group">
                <button
                  onClick={() => {
                    fetchFinalProjectsByCourse(courseId);
                    setShowProjectModal(true);
                  }}
                  className="p-3 border rounded-lg hover:bg-black hover:text-white transition"
                >
                  <FolderOpen size={22} />
                </button>

                {/* Hover Text */}
                <span
                  className="absolute left-full mr-3 top-1/2 -translate-y-1/2 
                   bg-black text-white text-xs px-3 py-1 rounded 
                   opacity-0 group-hover:opacity-100 
                   transition whitespace-nowrap"
                >
                  Final Projects
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ================= MAIN GRID ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ================= INSTRUCTORS ================= */}
          <div className="border rounded-xl p-5 bg-white flex flex-col h-[560px]">
            <div className="flex justify-between mb-4">
              <h2 className="flex items-center gap-2 font-semibold">
                <Users size={18} />
                Instructors
              </h2>

              <button
                onClick={() => setShowInstructorModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md hover:bg-gray-100"
              >
                <Plus size={16} />
                Assign
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {instructors.length > 0 ? (
                instructors.map((inst) => (
                  <div
                    key={inst.id}
                    onClick={() => {
                      setSelectedInstructor(inst);
                      setShowUpdateInstructorModal(true);
                    }}
                    className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition cursor-pointer flex justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-base">{inst.name}</p>

                      <p className="text-xs text-gray-500">ID: {inst.id}</p>

                      <p className="text-xs text-gray-500">
                        Aadhaar: {inst.aadhaarNo}
                      </p>

                      <p className="text-xs text-gray-500">
                        DOB:{" "}
                        {inst.dob
                          ? new Date(inst.dob).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : !instructorLoading ? (
                <p className="text-sm text-gray-400">No instructors assigned</p>
              ) : (
                <p className="text-sm text-gray-400">Loading...</p>
              )}
            </div>
          </div>

          {/* ================= STUDENTS ================= */}
          <div className="border rounded-xl p-5 bg-white flex flex-col h-[560px]">
            <div className="flex justify-between mb-4">
              <h2 className="flex items-center gap-2 font-semibold">
                <GraduationCap size={18} />
                Students
              </h2>

              <button
                onClick={() => setShowStudentModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border rounded-md hover:bg-gray-100"
              >
                <Plus size={16} />
                Enroll
              </button>
            </div>

            {/* Search */}
            <div className="flex gap-2 mb-4">
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name, ID or Aadhaar"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />

              <button
                onClick={() => searchStudentsInCourse(courseId, studentSearch)}
                className="px-4 py-2 bg-black text-white rounded-md text-sm"
              >
                Search
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {students.length > 0 ? (
                students.map((stu) => (
                  <div
                    key={stu.id}
                    onClick={() => {
                      setSelectedStudent(stu);
                      setShowUpdateStudentModal(true);
                    }}
                    className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition cursor-pointer flex justify-between"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-base">{stu.name}</p>
                      <p className="text-xs text-gray-500">ID: {stu.id}</p>
                      <p className="text-xs text-gray-500">
                        Aadhaar: {stu.aadhaarNo}
                      </p>
                      <p className="text-xs text-gray-500">
                        DOB:{" "}
                        {stu.dob
                          ? new Date(stu.dob).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>

                    <span className="h-8 inline-block px-3 py-1 text-xs font-semibold bg-gray-100 rounded-full">
                      {" "}
                      Grade: {stu.grade ?? "N/A"}{" "}
                    </span>
                  </div>
                ))
              ) : !studentLoading ? (
                <p className="text-sm text-gray-400">No students found</p>
              ) : (
                <p className="text-sm text-gray-400">Loading...</p>
              )}
            </div>

            {studentHasMore && !studentLoading && (
              <button
                onClick={() => fetchStudentsByCourse(courseId, false)}
                className="mt-3 px-4 py-2 border rounded-md hover:bg-gray-100 text-sm"
              >
                Load More
              </button>
            )}
          </div>
        </section>
      </main>

      {/* ================= MODALS ================= */}
      <EnrollStudentModal
        open={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        courseId={courseId}
      />

      <UpdateStudentModal
        open={showUpdateStudentModal}
        onClose={() => {
          setShowUpdateStudentModal(false);
          setSelectedStudent(null);
        }}
        courseId={courseId}
        student={selectedStudent}
      />

      <AssignInstructorModal
        open={showInstructorModal}
        onClose={() => setShowInstructorModal(false)}
        courseId={courseId}
      />

      <UpdateInstructorModal
        open={showUpdateInstructorModal}
        onClose={() => {
          setShowUpdateInstructorModal(false);
          setSelectedInstructor(null);
        }}
        courseId={courseId}
        instructor={selectedInstructor}
      />

      <FinalProjectModal
        open={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        courseId={courseId}
      />
      <Footer />
      {showSyllabusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative">
            <button
              onClick={() => setShowSyllabusModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Course Syllabus</h2>

            <div className="text-sm text-gray-700 space-y-2 max-h-[400px] overflow-y-auto">
              <p>{course.syllabus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
