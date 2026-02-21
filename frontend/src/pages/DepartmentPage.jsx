import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Pencil, BookOpen, ChevronRight, MapPin } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AddCourseModal from "../components/department/AddCourseModal";
import EditCourseModal from "../components/department/EditCourseModal";

import { useDepartment } from "../context/DepartmentContext";

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();

  const { department, fetchDepartment, courses, fetchCoursesByDepartment } =
    useDepartment();

  const [addOpen, setAddOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (departmentId) {
      fetchDepartment(departmentId);
      fetchCoursesByDepartment(departmentId);
    }
  }, [departmentId]);

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar active="home" />

      <main className="flex-1 pt-28 pb-20 px-6 max-w-5xl mx-auto space-y-12 w-full">
        {/* ================= DEPARTMENT HEADER ================= */}
        <section className="bg-white border rounded-2xl p-8 shadow-sm">
          <h1 className="text-4xl font-bold tracking-tight">
            {department?.name || "Department"}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
            <MapPin size={16} />
            {department?.location || "Location not specified"}
          </div>

          <div className="mt-6 border-t pt-6 text-sm text-gray-500">
            Academic Courses Offered
          </div>
        </section>

        {/* ================= COURSES HEADER ================= */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Courses</h2>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5
                       bg-black text-white rounded-lg
                       hover:bg-zinc-800 transition"
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>

        {/* ================= COURSE LIST ================= */}
        <div className="grid gap-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="group flex items-center bg-white border
                           border-gray-200 rounded-xl p-5
                           hover:border-black transition"
              >
                <div
                  onClick={() =>
                    navigate(`/department/${departmentId}/course/${course.id}`)
                  }
                  className="flex-1 cursor-pointer pr-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 bg-gray-50 rounded-lg
                                group-hover:bg-black
                                group-hover:text-white transition"
                    >
                      <BookOpen size={20} />
                    </div>

                    <h3 className="text-lg font-bold group-hover:underline">
                      {course.title}
                    </h3>
                  </div>

                  <div className="ml-11 flex gap-3 text-sm text-gray-500">
                    <span>Year {course.year}</span>
                    <span>•</span>
                    <span>{course.duration} Months</span>
                  </div>

                  {/* SUBJECT TAGS */}
                  <div className="ml-11 mt-4 flex flex-wrap gap-2">
                    {course.subjectAreas?.map((s, idx) => {
                      const name = typeof s === "string" ? s : s.name;
                      return (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 text-[11px]
                                     font-bold uppercase tracking-wider
                                     border rounded bg-gray-50 text-gray-600"
                        >
                          {name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <div className="flex items-center gap-2 pl-4 border-l">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCourse(course);
                    }}
                    className="p-2.5 text-gray-400
                               hover:text-black hover:bg-gray-100
                               rounded-lg transition"
                  >
                    <Pencil size={18} />
                  </button>

                  <ChevronRight className="text-gray-300 group-hover:text-black transition" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-xl">
              <p className="text-gray-400">
                No courses found for this department
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ================= MODALS ================= */}

      <AddCourseModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        departmentId={departmentId}
      />

      <EditCourseModal
        open={!!editCourse}
        course={editCourse}
        departmentId={departmentId}
        onClose={() => setEditCourse(null)}
      />
      <Footer />
    </div>
  );
};

export default DepartmentPage;
