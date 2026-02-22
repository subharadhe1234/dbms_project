import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useReport } from "../context/ReportContext";

function ReportPage() {
  const {
    facultyEducation,
    teachingLoad,
    highAchievers,
    fetchFacultyContinuingEducation,
    fetchTeachingLoadReport,
    fetchHighAchieversReport,
  } = useReport();

  useEffect(() => {
    fetchFacultyContinuingEducation();
    fetchTeachingLoadReport();
    fetchHighAchieversReport();
  }, []);

  /* ================= KPI CALCULATIONS ================= */

  const totalDepartments = teachingLoad.length;

  const totalStudents = teachingLoad.reduce(
    (sum, d) => sum + Number(d.totalStudents || 0),
    0,
  );

  const totalInstructors = teachingLoad.reduce(
    (sum, d) => sum + Number(d.totalInstructors || 0),
    0,
  );

  const departmentStats = teachingLoad?.map((dept) => {
    return {
      shortName:
        dept.departmentName.match(/[A-Z]/g)?.join("") ||
        dept.departmentName.slice(0, 3).toUpperCase(),
      totalCourses: Number(dept.totalCourses),
      totalInstructors: Number(dept.totalInstructors),
      totalStudents: Number(dept.totalStudents),
    };
  });

  const intensityData = teachingLoad?.map((dept) => {
    const students = Number(dept.totalStudents);
    const instructors = Number(dept.totalInstructors);

    return {
      shortName:
        dept.departmentName.match(/[A-Z]/g)?.join("") ||
        dept.departmentName.slice(0, 3).toUpperCase(),

      studentsPerInstructor:
        instructors === 0 ? 0 : (students / instructors).toFixed(2),
    };
  });

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar active="reports" />

      <main className="flex-1 pt-24 pb-20 px-12 space-y-16">
        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            University Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Institutional Academic Performance Report
          </p>
        </div>

        {/* ================= KPI CARDS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border p-8 rounded-2xl">
            <p className="text-sm text-gray-600">Departments</p>
            <h2 className="text-4xl font-bold mt-3">{totalDepartments}</h2>
          </div>

          <div className="border p-8 rounded-2xl">
            <p className="text-sm text-gray-600">Total Students</p>
            <h2 className="text-4xl font-bold mt-3">{totalStudents}</h2>
          </div>

          <div className="border p-8 rounded-2xl">
            <p className="text-sm text-gray-600">Total Instructors</p>
            <h2 className="text-4xl font-bold mt-3">{totalInstructors}</h2>
          </div>
        </section>

        {/* ================= TWO CHARTS ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ===== Teaching Load Chart ===== */}
          <div className="border p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6">
              Department Statistics (Teaching Load)
            </h2>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="shortName"
                    // angle={-15}
                    textAnchor="end"
                    height={60}
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="totalCourses" fill="#000000" name="Courses" />

                  <Bar
                    dataKey="totalInstructors"
                    fill="#555555"
                    name="Instructors"
                  />

                  <Bar dataKey="totalStudents" fill="#999999" name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ===== Intensity Chart ===== */}
          <div className="border p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6">
              Student–Instructor Intensity
            </h2>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intensityData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="shortName"
                    // angle={-15}
                    textAnchor="end"
                    height={60}
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="studentsPerInstructor"
                    fill="#000000"
                    name="Students per Instructor"
                    barSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ================= FACULTY CONTINUING EDUCATION ================= */}
        <section className="border p-10 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-8">
            Faculty Continuing Education
          </h2>

          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b sticky top-0 bg-white">
                  <tr>
                    <th className="py-3 text-left">Instructor ID</th>
                    <th className="text-left">Student ID</th>
                    <th className="text-left">Instructor Name</th>
                    <th className="text-left">Aadhaar No</th>
                    <th className="text-left">Date of Birth</th>
                  </tr>
                </thead>

                <tbody>
                  {facultyEducation && facultyEducation.length > 0 ? (
                    facultyEducation.map((f, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{f.instructorId}</td>
                        <td>{f.studentId}</td>
                        <td className="font-medium">{f.instructorName}</td>
                        <td>{f.aadhaarNo}</td>
                        <td>{new Date(f.dob).toLocaleDateString("en-GB")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-500"
                      >
                        No faculty education records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= HIGH ACHIEVERS ================= */}
        <section className="border p-10 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-8">
            Notable Final Project Contributors
          </h2>

          <div className="overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="border-b sticky top-0 bg-white">
                  <tr>
                    <th className="py-3 text-left">Student ID</th>
                    <th className="text-left">Student Name</th>
                    <th className="text-left">Project Title</th>
                    <th className="text-left">Course Title</th>
                    <th className="text-left">Department</th>
                    <th className="text-left">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {highAchievers && highAchievers.length > 0 ? (
                    highAchievers.map((student, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{student.studentId}</td>
                        <td className="font-medium">{student.studentName}</td>
                        <td>{student.projectTitle}</td>
                        <td>{student.courseTitle}</td>
                        <td>{student.departmentName}</td>
                        <td>
                          <span className="px-3 py-1 text-xs font-semibold border rounded-full">
                            {student.grade}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-500"
                      >
                        No notable contributors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ReportPage;
