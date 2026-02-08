import api from "./api";

/* =========================
   DEPARTMENT APIs
========================= */

// Get all departments
export const getAllDepartmentsApi = () => {
  return api.get("/departments");
};

// Create new department
export const createDepartmentApi = (data) => {
  return api.post("/departments", data);
};

// Update department
export const updateDepartmentApi = (departmentId, data) => {
  return api.put(`/departments/${departmentId}`, data);
};

/* =========================
   SUBJECT AREA APIs
   base: /departments/subject-areas
========================= */

// Get all subject areas
export const getAllSubjectAreasApi = () => {
  return api.get("/departments/subject-areas");
};

// Add new subject area
export const addSubjectAreaApi = (data) => {
  return api.post("/departments/subject-areas", data);
};

// Update subject area name
export const updateSubjectAreaApi = (oldName, data) => {
  return api.put(`/departments/subject-areas/${oldName}`, data);
};
