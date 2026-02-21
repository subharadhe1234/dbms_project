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

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

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
              Teaching Load (Students)
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teachingLoad}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortName"
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalStudents" fill="#000000" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ===== Intensity Chart ===== */}
          <div className="border p-8 rounded-2xl">
            <h2 className="text-xl font-semibold mb-6">
              Students Per Instructor
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teachingLoad}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="shortName"
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="studentsPerInstructor"
                    fill="#4b5563"
                    barSize={40}
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
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="py-3 text-left">Instructor</th>
                  <th className="text-left">Department</th>
                  <th className="text-left">Program</th>
                </tr>
              </thead>
              <tbody>
                {facultyEducation.map((f, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{f.name}</td>
                    <td>{f.departmentName}</td>
                    <td>{f.programName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= HIGH ACHIEVERS ================= */}
        <section className="border p-10 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-8">
            Notable Final Project Contributors
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {highAchievers.map((student, index) => (
              <div
                key={index}
                className="border p-6 rounded-xl hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{student.studentName}</h3>

                <p className="text-sm text-gray-600 mt-2">
                  Project: {student.projectTitle}
                </p>

                <p className="text-sm text-gray-600">
                  Department: {student.departmentName}
                </p>

                <span className="inline-block mt-4 px-4 py-1 text-xs font-semibold border rounded-full">
                  Grade: {student.grade}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ReportPage;
