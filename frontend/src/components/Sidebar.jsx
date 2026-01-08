import { Database, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDB } from "../context/DBContext";

export default function Sidebar({ tables = [], selectedTable, onTableSelect }) {
  const navigate = useNavigate();
  const { database, setDatabase } = useDB();

  const databases = [
    { id: "university", label: "University", path: "/university" },
    { id: "research", label: "Research", path: "/research" },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-700 h-screen flex flex-col">
      {/* DATABASE SECTION */}
      <div className="px-4 py-4 border-b border-neutral-700">
        <h2 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">
          Databases
        </h2>

        {databases.map((db) => {
          const active = db.id === database;

          return (
            <button
              key={db.id}
              onClick={() => {
                setDatabase(db.id); // ✅ context is source of truth
                navigate(db.path);
                onTableSelect(null);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                transition
                ${
                  active
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:bg-neutral-800"
                }`}
            >
              <Database size={16} />
              {db.label}
            </button>
          );
        })}
      </div>

      {/* TABLES SECTION */}
      <div className="px-2 py-4 flex-1 overflow-auto">
        <h2 className="px-2 text-xs uppercase tracking-wider text-neutral-400 mb-2">
          Tables
        </h2>

        <div className="space-y-1">
          {tables.length === 0 && (
            <p className="px-3 text-xs text-neutral-500">No tables available</p>
          )}

          {tables.map((table) => {
            const active = table === selectedTable;

            return (
              <button
                key={table}
                onClick={() => onTableSelect(table)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                  transition
                  ${
                    active
                      ? "bg-neutral-700 text-white"
                      : "text-neutral-400 hover:bg-neutral-800"
                  }`}
              >
                <Table size={14} />
                {table}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
