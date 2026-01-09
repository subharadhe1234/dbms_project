import { createContext, useContext, useEffect, useState } from "react";

const DBContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const normalizeRow = (row) => {
  const clean = {};
  Object.keys(row).forEach((k) => {
    const v = row[k];
    clean[k] = v === "" || v === undefined ? null : v;
  });
  return clean;
};

const parseError = async (res) => {
  let message = "Database operation failed";

  try {
    const err = await res.json();
    message = err.error || err.message || message;
  } catch {
    // ignore JSON parse error
  }

  return message;
};

export function DBProvider({ children }) {
  const [database, setDatabase] = useState("university");
  const [tables, setTables] = useState([]);
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState({});

  const clearError = () => setError(null);

  /* =====================================================
     FETCH: TABLE LIST
     ===================================================== */
  const fetchTables = async (db = database) => {
    try {
      const res = await fetch(`${API_BASE}/api/${db}/tables`);
      if (!res.ok) throw new Error(await parseError(res));

      const json = await res.json();
      setTables(json.tables || []);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
   FETCH: REPORT LIST (PER DATABASE)
   ===================================================== */
  const fetchReports = async (db = database) => {
    try {
      const res = await fetch(`${API_BASE}/api/${db}/reports`);
      if (!res.ok) throw new Error(await parseError(res));

      const json = await res.json();
      setReports(json.reports || []);
    } catch (err) {
      setError(err.error || err.message || "Failed to fetch reports");
    }
  };

  /* =====================================================
     FETCH: TABLE SCHEMA
     ===================================================== */
  const fetchSchema = async (table) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/${database}/tables/${table}/schema`
      );
      if (!res.ok) throw new Error(await parseError(res));

      const json = await res.json();
      setSchema(json);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
     FETCH: TABLE DATA
     ===================================================== */
  const fetchTableData = async (table) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/${database}/tables/${table}/data`
      );
      if (!res.ok) throw new Error(await parseError(res));

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
   FETCH: REPORT DATA
   ===================================================== */
  /* =====================================================
   FETCH: REPORT DATA
   ===================================================== */
  const fetchReportData = async (reportId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/${database}/reports/${reportId}`
      );

      if (!res.ok) throw new Error(await parseError(res));

      const json = await res.json();

      setReportData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INSERT ROW (FULL ROW)
     ===================================================== */
  const insertRow = async (table, row) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/${database}/tables/${table}/insert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizeRow(row)),
        }
      );

      if (!res.ok) throw new Error(await parseError(res));

      await fetchTableData(table);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
     UPDATE ROW (FULL ROW, BUFFERED SAVE)
     ===================================================== */
  const updateRow = async (table, data, where) => {
    try {
      if (!data || !where) {
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/${database}/tables/${table}/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: normalizeRow(data),
            where,
          }),
        }
      );

      if (!res.ok) throw new Error(await parseError(res));

      await fetchTableData(table);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
     DELETE ROW
     ===================================================== */
  const deleteRow = async (table, pk) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/${database}/tables/${table}/delete`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ where: pk }),
        }
      );

      if (!res.ok) throw new Error(await parseError(res));

      await fetchTableData(table);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
     DATABASE SWITCH
     ===================================================== */
  const changeDatabase = async (db) => {
    try {
      setDatabase(db);
      setTables([]);
      setSchema({});
      setData({});
      setReportData({});
      setReports([]);
      await fetchTables(db);
      await fetchReports(db);
    } catch (err) {
      setError(err.message);
    }
  };

  /* =====================================================
     INIT
     ===================================================== */
  useEffect(() => {
    fetchTables(database);
    fetchReports(database);
  }, []);

  /* =====================================================
     CONTEXT VALUE
     ===================================================== */
  return (
    <DBContext.Provider
      value={{
        /* state */
        database,
        tables,
        schema,
        data,
        loading,
        error,
        reports,
        reportData,

        /* actions */
        clearError,
        setDatabase: changeDatabase,
        fetchSchema,
        fetchTableData,
        insertRow,
        updateRow,
        deleteRow,
        fetchReports,
        fetchReportData,
      }}
    >
      {children}
    </DBContext.Provider>
  );
}

/* =====================================================
   HOOK
   ===================================================== */
export function useDB() {
  return useContext(DBContext);
}
