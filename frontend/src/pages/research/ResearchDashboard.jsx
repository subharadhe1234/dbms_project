import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import GenericTable from "../../components/GenericTable";
import { useDB } from "../../context/DBContext";

export default function ResearchDashboard() {
  const { tables, database } = useDB();
  const [selectedTable, setSelectedTable] = useState(null);

  /* Reset selected table when database changes */
  useEffect(() => {
    setSelectedTable(null);
  }, [database]);

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-200">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        tables={tables}
        selectedTable={selectedTable}
        onTableSelect={setSelectedTable}
      />

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="h-14 border-b border-neutral-700 flex items-center px-6">
          <h1 className="text-sm font-medium text-neutral-300">
            Database
            <span className="mx-2 text-neutral-500">/</span>
            <span className="text-white capitalize">{database}</span>
          </h1>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-6 overflow-auto">
          {!selectedTable ? (
            /* EMPTY STATE */
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-lg font-medium text-neutral-300">
                  Select a research table
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose a research-related table from the sidebar
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* TABLE TITLE */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {selectedTable}
                </h2>
                <p className="text-sm text-neutral-500">
                  Research database table
                </p>
              </div>

              {/* TABLE CONTAINER */}
              <div className="border border-neutral-700 rounded-lg bg-neutral-900 p-4">
                <GenericTable table={selectedTable} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
