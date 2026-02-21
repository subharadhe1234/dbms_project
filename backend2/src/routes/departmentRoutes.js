import express from "express";
import {
  //department
  getDepartment,
  getCoursesByDepartment,
  addCourseToDepartment,
  updateCourse,
  deleteCourse,

  //student
  getStudentByAadhaar,
  assignNewStudentToCourse,
  assignExistingStudentToCourse,
  getStudentsByCourse,
  searchStudentsInCourse,
  updateStudentDetails,
  removeStudentFromCourse,

  //instructor
  getInstructorByAadhaar,
  assignNewInstructorToCourse,
  assignExistingInstructorToCourse,
  getInstructorsByCourse,
  updateInstructorDetails,
  removeInstructorFromCourse,

  //final projects
  getFinalProjectsByCourse,
  updateFinalProject,
  addFinalProject,
  deleteFinalProject,
} from "../controller/departmentController.js";

const departmentRouter = express.Router();

//department
departmentRouter.get("/:departmentId", getDepartment);
departmentRouter.get("/:departmentId/courses", getCoursesByDepartment);
departmentRouter.post("/:departmentId/courses", addCourseToDepartment);
departmentRouter.put("/:departmentId/courses/:courseId", updateCourse);
departmentRouter.delete("/:departmentId/courses/:courseId", deleteCourse);

//student
departmentRouter.get(
  "/courses/:courseId/student-by-aadhaar",
  getStudentByAadhaar,
);
departmentRouter.post(
  "/courses/:courseId/enroll-new-student",
  assignNewStudentToCourse,
);
departmentRouter.post(
  "/courses/:courseId/enroll-student",
  assignExistingStudentToCourse,
);
departmentRouter.get("/courses/:courseId/students", getStudentsByCourse);

departmentRouter.get(
  "/courses/:courseId/students/search",
  searchStudentsInCourse,
);
departmentRouter.put(
  "/courses/:courseId/students/:studentId",
  updateStudentDetails,
);
departmentRouter.delete(
  "/courses/:courseId/students/:studentId",
  removeStudentFromCourse,
);

//instructor
departmentRouter.get(
  "/courses/:courseId/instructor-by-aadhaar",
  getInstructorByAadhaar,
);

departmentRouter.post(
  "/courses/:courseId/assign-new-instructor",
  assignNewInstructorToCourse,
);

departmentRouter.post(
  "/courses/:courseId/assign-instructor",
  assignExistingInstructorToCourse,
);

departmentRouter.get("/courses/:courseId/instructors", getInstructorsByCourse);

departmentRouter.put(
  "/courses/:courseId/instructors/:instructorId",
  updateInstructorDetails,
);

departmentRouter.delete(
  "/courses/:courseId/instructors/:instructorId",
  removeInstructorFromCourse,
);

//Final projects

departmentRouter.get(
  "/courses/:courseId/final-projects",
  getFinalProjectsByCourse,
);
departmentRouter.post(
  "/enrollments/:enrollmentId/final-project",
  addFinalProject,
);
departmentRouter.put("/final-project/:projectId", updateFinalProject);
departmentRouter.delete("/final-project/:projectId", deleteFinalProject);

export default departmentRouter;
