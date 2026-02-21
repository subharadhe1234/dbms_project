import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllDepartmentsApi,
  createDepartmentApi,
  updateDepartmentApi,
  getAllSubjectAreasApi,
  addSubjectAreaApi,
  updateSubjectAreaApi,
} from "../api/adminApi";

const AdminContext = createContext(null);
export const AdminProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllDepartmentsApi();
      setDepartments(res.data);
    } catch (err) {
      console.error("fetchDepartments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (data) => {
    try {
      setLoading(true);
      // setError(null);

      const res = await createDepartmentApi(data);
      const department = res.data;
      if (department.message) {
        alert(department.message);
      }
      setDepartments((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("create Department Error :", err);
      const msg = err?.response?.data?.message || "Failed to create department";
      alert(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id, data) => {
    try {
      setLoading(true);
      // setError(null);

      const res = await updateDepartmentApi(id, data);
      const updatedDept = res.data;

      // Update department in state
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === id ? { ...dept, ...updatedDept } : dept,
        ),
      );

      if (updatedDept.message) {
        alert(updatedDept.message);
      }
    } catch (err) {
      console.error("Update Department Error:", err);
      const msg = err?.response?.data?.message || "Failed to update department";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // SUBJECT AREA

  const fetchSubjectAreas = async () => {
    try {
      setLoading(true);
      const res = await getAllSubjectAreasApi();
      setSubjectAreas(res.data);
    } catch (err) {
      console.error("fetchSubjectAreas error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addSubjectArea = async (name) => {
    try {
      setLoading(true);
      const res = await addSubjectAreaApi({ name });
      setSubjectAreas((prev) => [...prev, res.data.name]);
    } catch (err) {
      console.error("addSubjectArea error:", err);
      const msg = err?.response?.data?.message || "Failed to add Subject Area";
      alert(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubjectArea = async (oldName, newName) => {
    try {
      setLoading(true);
      const res = await updateSubjectAreaApi(oldName, {
        name: newName,
      });

      setSubjectAreas((prev) =>
        prev.map((name) => (name === oldName ? res.data.name : name)),
      );
    } catch (err) {
      console.error("updateSubjectArea error:", err);
      const msg =
        err?.response?.data?.message || "Failed to update Subject Area";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSubjectAreas();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        /* departments */
        departments,
        createDepartment,
        updateDepartment,
        fetchDepartments,

        /* subject areas */
        subjectAreas,
        addSubjectArea,
        updateSubjectArea,
        fetchSubjectAreas,

        /* common */
        loading,
        error,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useDepartment must be used inside DepartmentProvider");
  }
  return context;
};
