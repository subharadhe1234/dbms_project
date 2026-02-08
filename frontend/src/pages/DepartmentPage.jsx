import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Optional frontend guard
    if (user.role !== "admin" && String(user.departmentId) !== departmentId) {
      navigate("/login", { replace: true });
      return;
    }

    // TODO: replace with API
    setCourses([
      { id: 101, name: "Data Structures" },
      { id: 102, name: "Operating Systems" },
      { id: 103, name: "Database Systems" },
    ]);
  }, [departmentId, user, navigate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Department ID: {departmentId}
      </h1>

      {/* COURSE LIST */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Courses</h2>

        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`course/${course.id}`)}
              className="border rounded p-3 cursor-pointer hover:bg-gray-100"
            >
              {course.name}
            </div>
          ))}
        </div>
      </div>

      {/* NESTED COURSE PAGE */}
      <Outlet />
    </div>
  );
};

export default DepartmentPage;
