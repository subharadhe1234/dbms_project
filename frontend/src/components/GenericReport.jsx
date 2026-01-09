import { useEffect } from "react";
import { useDB } from "../context/DBContext";

export default function GenericReport({ reportId }) {
  const { reports, reportData, fetchReportData, loading } = useDB();

  useEffect(() => {
    fetchReportData(reportId);
  }, [reportId]);

  if (!reportId) {
    return (
      <div className="h-full flex items-center justify-center text-neutral-500">
        Select a report to view
      </div>
    );
  }

  if (!reportData && loading) {
    return (
      <div className="border border-neutral-700 rounded-lg bg-neutral-900 p-6 text-neutral-400">
        Loading report…
      </div>
    );
  }

  if (!reportData || !reportData.data || reportData.data.length === 0) {
    return (
      <div className="border border-neutral-700 rounded-lg bg-neutral-900 p-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          {reportData.title || "Report"}
        </h2>
        <p className="text-sm text-neutral-500">
          No data available for this report
        </p>
      </div>
    );
  }

  /* ===============================
     RENDER TABLE
     =============================== */
  const { title, data } = reportData;
  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-auto">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm text-neutral-500">Generated report</p>
      </div>

      {/* TABLE */}
      <table className="min-w-max border-collapse text-[12px] text-neutral-200">
        <thead className="sticky top-0 bg-neutral-900 z-10">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-neutral-700 px-2 py-1 text-left"
              >
                {formatColumn(col)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-neutral-800 hover:bg-neutral-850"
            >
              {columns.map((col) => (
                <td key={col} className="border border-neutral-800 px-2 py-1">
                  {renderValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===============================
   HELPERS
   =============================== */

function formatColumn(col) {
  return col.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
}
