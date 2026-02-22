import api from "./api";

//DEPARTMENT

export const getAllDepartmentsApi = () => {
  return api.get("/admin");
};

export const createDepartmentApi = (data) => {
  return api.post("/admin", data);
};

export const updateDepartmentApi = (departmentId, data) => {
  return api.put(`/admin/${departmentId}`, data);
};

//SUBJECT AREA

export const getAllSubjectAreasApi = () => {
  return api.get("/admin/subject-areas");
};

export const addSubjectAreaApi = (data) => {
  return api.post("/admin/subject-areas", data);
};

export const updateSubjectAreaApi = (oldName, data) => {
  return api.put(`/admin/subject-areas/${oldName}`, data);
};
