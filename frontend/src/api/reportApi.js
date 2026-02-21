import api from "./api";

export const getFacultyContinuingEducation = () =>
  api.get("/reports/faculty-continuing-education");

export const getTeachingLoadReport = () => api.get("/reports/teaching-load");

export const getHighAchieversReport = () => api.get("/reports/high-achievers");
