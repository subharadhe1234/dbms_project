import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import GenericTable from "../../components/GenericTable";
import GenericReport from "../../components/GenericReport";
import { useDB } from "../../context/DBContext";

export default function ResearchDashboard() {
  const { tables, reports, database } = useDB();

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  /* RESET ON DATABASE CHANGE */
  useEffect(() => {
    setSelectedTable(null);
    setSelectedReportId(null);
  }, [database]);

  return (
    <div className="flex h-screen bg-neutral-900 text-neutral-200 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar
        tables={tables}
        reports={reports}
        selectedTable={selectedTable}
        selectedReportId={selectedReportId}
        onTableSelect={setSelectedTable}
        onReportSelect={setSelectedReportId}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-700 flex items-center px-6">
          <h1 className="text-sm font-medium text-neutral-300">
            Database
            <span className="mx-2 text-neutral-500">/</span>
            <span className="text-white capitalize">{database}</span>
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {!selectedTable && !selectedReportId && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-lg font-medium text-neutral-300">
                  Select a table or report
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose from the sidebar
                </p>
              </div>
            </div>
          )}

          {/* TABLE VIEW */}
          {selectedTable && (
            <div className="border border-neutral-700 rounded-lg bg-neutral-900 p-4">
              <GenericTable table={selectedTable} />
            </div>
          )}

          {/* REPORT VIEW */}
          {selectedReportId && (
            <div className="border border-neutral-700 rounded-lg bg-neutral-900 p-4">
              <GenericReport reportId={selectedReportId} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
