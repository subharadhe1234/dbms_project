import { Database, Table, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDB } from "../context/DBContext";

export default function Sidebar({
  tables = [],
  reports = [],
  selectedTable,
  selectedReportId,
  onTableSelect,
  onReportSelect,
}) {
  const navigate = useNavigate();
  const { database, setDatabase } = useDB();

  const databases = [
    { id: "university", label: "University", path: "/university" },
    { id: "research", label: "Research", path: "/research" },
  ];

  return (
    <aside className="w-64 h-screen bg-neutral-900 border-r border-neutral-700 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto bg-neutral-900">
        <div className="px-4 py-4 border-b border-neutral-700">
          <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
            Databases
          </h2>

          {databases.map((db) => {
            const active = db.id === database;

            return (
              <button
                key={db.id}
                type="button"
                onClick={() => {
                  setDatabase(db.id);
                  navigate(db.path);
                  onTableSelect(null);
                  onReportSelect(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                  transition-colors
                  ${
                    active
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400 hover:bg-neutral-800"
                  }`}
              >
                <Database size={16} />
                <span className="truncate">{db.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TABLES ================= */}
        <div className="px-2 py-4">
          <h2 className="px-2 text-xs uppercase tracking-wider text-neutral-400 mb-2">
            Tables
          </h2>

          <div className="space-y-1">
            {tables.length === 0 && (
              <p className="px-3 text-xs text-neutral-500">
                No tables available
              </p>
            )}

            {tables.map((table) => {
              const active = table === selectedTable;

              return (
                <button
                  key={table}
                  type="button"
                  onClick={() => {
                    onTableSelect(table);
                    onReportSelect(null);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                    transition-colors
                    ${
                      active
                        ? "bg-neutral-700 text-white"
                        : "text-neutral-400 hover:bg-neutral-800"
                    }`}
                >
                  <Table size={14} />
                  <span className="truncate">{table}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= REPORTS ================= */}
        <div className="px-2 py-4 border-t border-neutral-700">
          <h2 className="px-2 text-xs uppercase tracking-wider text-neutral-400 mb-2">
            Reports
          </h2>

          <div className="space-y-1">
            {reports.length === 0 && (
              <p className="px-3 text-xs text-neutral-500">
                No reports available
              </p>
            )}

            {reports.map((report) => {
              const active = report.id === selectedReportId;

              return (
                <button
                  key={report.id}
                  type="button"
                  title={report.title}
                  onClick={() => {
                    onReportSelect(report.id);
                    onTableSelect(null);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                    transition-colors
                    ${
                      active
                        ? "bg-neutral-700 text-white"
                        : "text-neutral-400 hover:bg-neutral-800"
                    }`}
                >
                  <BarChart3 size={14} />
                  <span className="truncate">{report.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
