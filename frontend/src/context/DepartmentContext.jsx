import { createContext, useContext, useState, useEffect } from "react";

import * as departmentApi from "../api/departmentApi";
import { getAllSubjectAreasApi } from "../api/adminApi";

const DepartmentContext = createContext(null);

export const DepartmentProvider = ({ children }) => {
  const handleRequest = async (fn) => {
    try {
      // setLoading(true);
      // setError(null);
      return await fn();
    } catch (err) {
      console.error(err);
      // setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      // setLoading(false);
    }
  };

  //  SUBJECT AREAS
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const fetchSubjectAreas = async () => {
    setSubjectLoading(true);

    try {
      const res = await getAllSubjectAreasApi();
      setSubjectAreas(res.data);
    } catch (error) {
      console.error("Failed to fetch subject areas", error);
    } finally {
      setSubjectLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjectAreas();
  }, []);

  // DEPARTMENT
  const [department, setDepartment] = useState({});
  const [departmentLoading, setDepartmentLoading] = useState(false);

  const fetchDepartment = async (departmentId) => {
    setDepartmentLoading(true);
    try {
      const res = await departmentApi.getDepartment(departmentId);
      setDepartment(res.data);
    } catch (error) {
      console.error("Failed to fetch department", error);
    } finally {
      setDepartmentLoading(false);
    }
  };

  //COURSES
  const [courses, setCourses] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);

  const fetchCoursesByDepartment = async (departmentId) => {
    setCourseLoading(true);

    try {
      const res = await departmentApi.getCoursesByDepartment(departmentId);
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setCourseLoading(false);
    }
  };

  const addCourse = async (departmentId, data) => {
    try {
      const res = await departmentApi.addCourseToDepartment(departmentId, data);

      return {
        success: true,
        message: "Course added successfully",
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to add course",
      };
    }
  };

  const updateCourse = async (departmentId, courseId, data) => {
    try {
      const res = await departmentApi.updateCourse(
        departmentId,
        courseId,
        data,
      );

      return {
        success: true,
        message: "Course updated successfully",
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to update course",
      };
    }
  };

  const deleteCourse = async (departmentId, courseId) => {
    try {
      await departmentApi.deleteCourse(departmentId, courseId);

      return {
        success: true,
        message: "Course deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to delete course",
      };
    }
  };

  //STUDENTS

  const [students, setStudents] = useState([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentCursor, setStudentCursor] = useState(null);
  const [studentHasMore, setStudentHasMore] = useState(true);

  const fetchStudentsByCourse = async (courseId, reset = false) => {
    if (studentLoading) return;

    setStudentLoading(true);

    try {
      const cursorToUse = reset ? null : studentCursor;

      const res = await departmentApi.getStudentsByCourse(
        courseId,
        cursorToUse,
      );

      const data = res.data.data;
      const nextCursor = res.data.nextCursor;

      if (reset) {
        setStudents(data);
      } else {
        setStudents((prev) => [...prev, ...data]);
      }

      setStudentCursor(nextCursor);
      setStudentHasMore(!!nextCursor);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setStudentLoading(false);
    }
  };

  const searchStudentsInCourse = async (courseId, query) => {
    if (!query.trim()) {
      setStudentCursor(null);
      setStudentHasMore(true);
      await fetchStudentsByCourse(courseId, true);
      return;
    }

    setStudentLoading(true);

    try {
      const res = await departmentApi.searchStudentsInCourse(courseId, query);

      setStudents(res.data.data);
      setStudentHasMore(false);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setStudentLoading(false);
    }
  };

  const enrollNewStudent = async (courseId, data) => {
    try {
      await departmentApi.enrollNewStudent(courseId, data);

      return {
        success: true,
        message: "Student enrolled successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to enroll student",
      };
    }
  };

  const enrollExistingStudent = async (courseId, data) => {
    try {
      await departmentApi.enrollExistingStudent(courseId, data);

      return {
        success: true,
        message: "Student enrolled successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to enroll student",
      };
    }
  };

  const updateStudent = async (courseId, studentId, data) => {
    try {
      const res = await departmentApi.updateStudent(courseId, studentId, data);

      return {
        success: true,
        message: res?.data?.message || "Student updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to update student",
      };
    }
  };

  const deleteStudent = async (courseId, studentId) => {
    try {
      await departmentApi.deleteStudent(courseId, studentId);

      return {
        success: true,
        message: "Student deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to delete student",
      };
    }
  };

  //INSTRUCTORS

  const [instructors, setInstructors] = useState([]);
  const [instructorLoading, setInstructorLoading] = useState(false);

  const fetchInstructorsByCourse = async (courseId) => {
    setInstructorLoading(true);

    try {
      const res = await departmentApi.getInstructorsByCourse(courseId);

      setInstructors(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch instructors", error);
    } finally {
      setInstructorLoading(false);
    }
  };

  const assignNewInstructor = async (courseId, data) => {
    try {
      const res = await departmentApi.assignNewInstructor(courseId, data);

      return {
        success: true,
        message: res?.data?.message || "Instructor assigned successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to assign instructor",
      };
    }
  };

  const assignExistingInstructor = async (courseId, data) => {
    try {
      const res = await departmentApi.assignExistingInstructor(courseId, data);

      return {
        success: true,
        message: res?.data?.message || "Instructor assigned successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to assign instructor",
      };
    }
  };

  const updateInstructor = async (courseId, instructorId, data) => {
    try {
      const res = await departmentApi.updateInstructor(
        courseId,
        instructorId,
        data,
      );

      return {
        success: true,
        message: res?.data?.message || "Instructor updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to update instructor",
      };
    }
  };

  const deleteInstructor = async (courseId, instructorId) => {
    try {
      await departmentApi.deleteInstructor(courseId, instructorId);

      return {
        success: true,
        message: "Instructor removed successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to remove instructor",
      };
    }
  };

  //FINAL PROJECTS
  const [finalProjects, setFinalProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(false);

  const fetchFinalProjectsByCourse = async (courseId) => {
    if (projectLoading) return;

    setProjectLoading(true);

    try {
      const res = await departmentApi.getFinalProjectsByCourse(courseId);

      setFinalProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch final projects", error);
    } finally {
      setProjectLoading(false);
    }
  };

  const addFinalProject = async (enrollmentId, data) => {
    try {
      await departmentApi.addFinalProject(enrollmentId, data);

      return {
        success: true,
        message: "Final project added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to add final project",
      };
    }
  };

  const updateFinalProject = async (projectId, data) => {
    try {
      const res = await departmentApi.updateFinalProject(projectId, data);

      return {
        success: true,
        message: res?.data?.message || "Final project updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to update final project",
      };
    }
  };
  const deleteFinalProject = async (projectId) => {
    try {
      await departmentApi.deleteFinalProject(projectId);

      return {
        success: true,
        message: "Final project deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to delete final project",
      };
    }
  };

  /* =====================================================
     VALUE
  ===================================================== */
  const value = {
    /* state */
    subjectAreas,
    subjectLoading,
    department,
    departmentLoading,
    fetchDepartment,

    /* course actions */
    courses,
    courseLoading,
    fetchCoursesByDepartment,
    addCourse,
    updateCourse,
    deleteCourse,

    /* student actions */
    students,
    studentLoading,
    studentHasMore,
    fetchStudentsByCourse,
    searchStudentsInCourse,
    enrollNewStudent,
    enrollExistingStudent,
    updateStudent,
    deleteStudent,

    /* instructor actions */
    instructors,
    instructorLoading,
    fetchInstructorsByCourse,
    assignNewInstructor,
    assignExistingInstructor,
    updateInstructor,
    deleteInstructor,

    /* final project actions */
    finalProjects,
    projectLoading,
    fetchFinalProjectsByCourse,
    addFinalProject,
    updateFinalProject,
    deleteFinalProject,
  };

  return (
    <DepartmentContext.Provider value={value}>
      {children}
    </DepartmentContext.Provider>
  );
};

/* =====================================================
   HOOK
===================================================== */
export const useDepartment = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartment must be used inside DepartmentProvider");
  }
  return context;
};
