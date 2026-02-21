import api from "./api";

//COURSES
export const getDepartment = (departmentId) =>
  api.get(`department/${departmentId}`);

export const getCoursesByDepartment = (departmentId) =>
  api.get(`/department/${departmentId}/courses`);

export const addCourseToDepartment = (departmentId, data) =>
  api.post(`/department/${departmentId}/courses`, data);

export const updateCourse = (departmentId, courseId, data) =>
  api.put(`/department/${departmentId}/courses/${courseId}`, data);

export const deleteCourse = (departmentId, courseId) =>
  api.delete(`/department/${departmentId}/courses/${courseId}`);

//STUDENTS

export const enrollNewStudent = (courseId, data) =>
  api.post(`/department/courses/${courseId}/enroll-new-student`, data);

export const getStudentByAadhaar = (courseId, aadhaar) =>
  api.get(
    `/department/courses/${courseId}/student-by-aadhaar?aadhaar=${aadhaar}`,
  );
export const enrollExistingStudent = (courseId, data) =>
  api.post(`/department/courses/${courseId}/enroll-student`, data);

export const getStudentsByCourse = (courseId, cursor = null) => {
  const url = cursor
    ? `/department/courses/${courseId}/students?cursor=${cursor}`
    : `/department/courses/${courseId}/students`;

  return api.get(url);
};

export const searchStudentsInCourse = (courseId, query) =>
  api.get(`/department/courses/${courseId}/students/search?q=${query}`);

export const updateStudent = (courseId, studentId, data) =>
  api.put(`/department/courses/${courseId}/students/${studentId}`, data);

export const deleteStudent = (courseId, studentId) =>
  api.delete(`/department/courses/${courseId}/students/${studentId}`);

//INSTRUCTORS

export const assignNewInstructor = (courseId, data) =>
  api.post(`/department/courses/${courseId}/assign-new-instructor`, data);

export const getInstructorByAadhaar = (courseId, aadhaar) =>
  api.get(
    `/department/courses/${courseId}/instructor-by-aadhaar?aadhaar=${aadhaar}`,
  );

export const assignExistingInstructor = (courseId, data) =>
  api.post(`/department/courses/${courseId}/assign-instructor`, data);

export const getInstructorsByCourse = (courseId) =>
  api.get(`/department/courses/${courseId}/instructors`);

export const updateInstructor = (courseId, instructorId, data) =>
  api.put(`/department/courses/${courseId}/instructors/${instructorId}`, data);

export const deleteInstructor = (courseId, instructorId) =>
  api.delete(`/department/courses/${courseId}/instructors/${instructorId}`);

//FINAL PROJECTS

export const getFinalProjectsByCourse = (courseId) =>
  api.get(`/department/courses/${courseId}/final-projects`);

export const addFinalProject = (enrollmentId, data) =>
  api.post(`/department/enrollments/${enrollmentId}/final-project`, data);

export const updateFinalProject = (projectId, data) =>
  api.put(`/department/final-project/${projectId}`, data);

export const deleteFinalProject = (projectId) =>
  api.delete(`/department/final-project/${projectId}`);
