import { Trash2, Save, Plus } from "lucide-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useDB } from "../context/DBContext";

export default function GenericTable({ table }) {
  const {
    data,
    schema,
    fetchSchema,
    fetchTableData,
    updateRow,
    insertRow,
    deleteRow,
    database,
  } = useDB();

  /* ===============================
     PRIMARY KEY DETECTION (DERIVED)
     =============================== */
  const pkColumns = useMemo(
    () => schema.filter((c) => c.Key === "PRI").map((c) => c.Field),
    [schema]
  );

  /* ===============================
     STABLE ROW KEY (DERIVED FUNCTION)
     =============================== */
  const makeRowKey = useCallback(
    (row, index) => {
      if (pkColumns.length) {
        const key = pkColumns.map((k) => row[k]).join("::");
        if (key && !key.includes("null") && key !== "::") {
          return key;
        }
      }
      return `row-${index}`;
    },
    [pkColumns]
  );

  /* ===============================
     STATE
     =============================== */
  const [draftRows, setDraftRows] = useState({});
  const [originalRows, setOriginalRows] = useState({});
  const [dirtyRows, setDirtyRows] = useState(new Set());

  const [newRow, setNewRow] = useState({});
  const [newRowDirty, setNewRowDirty] = useState(false);

  /* ===============================
     LOAD SCHEMA + DATA (STRICTMODE SAFE)
     =============================== */
  const fetchedTableRef = useRef(null);

  useEffect(() => {
    if (fetchedTableRef.current === table) return;

    fetchedTableRef.current = table;

    fetchSchema(table);
    fetchTableData(table);
  }, [table, database, fetchSchema, fetchTableData]);

  /* ===============================
     SYNC DATA → DRAFT + ORIGINAL SNAPSHOT
     =============================== */
  useEffect(() => {
    const draftMap = {};
    const originalMap = {};

    data.forEach((row, index) => {
      const key = makeRowKey(row, index);
      draftMap[key] = { ...row };
      originalMap[key] = { ...row };
    });

    setDraftRows(draftMap);
    setOriginalRows(originalMap);
    setDirtyRows(new Set());
  }, [data, makeRowKey]);

  /* ===============================
     HANDLERS
     =============================== */
  const onCellChange = (rowKey, column, value) => {
    setDraftRows((prev) => ({
      ...prev,
      [rowKey]: { ...prev[rowKey], [column]: value },
    }));
    setDirtyRows((prev) => new Set(prev).add(rowKey));
  };

  /* ===============================
     UPDATE ROW
     =============================== */
  const saveRow = (rowKey) => {
    const updatedRow = draftRows[rowKey];
    const originalRow = originalRows[rowKey];

    const where = {};
    pkColumns.forEach((k) => {
      where[k] = originalRow[k];
    });

    updateRow(table, updatedRow, where);

    setDirtyRows((prev) => {
      const next = new Set(prev);
      next.delete(rowKey);
      return next;
    });
  };

  /* ===============================
     INSERT ROW
     =============================== */
  const onNewCellChange = (column, value) => {
    setNewRow((prev) => ({ ...prev, [column]: value }));
    setNewRowDirty(true);
  };

  const saveNewRow = () => {
    insertRow(table, newRow);
    setNewRow({});
    setNewRowDirty(false);
  };

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="overflow-auto">
      <table className="min-w-max border-collapse text-[12px] text-neutral-200">
        <thead className="sticky top-0 bg-neutral-900 z-10">
          <tr>
            <th className="w-8 border border-neutral-700" />
            {schema.map((col) => (
              <th
                key={col.Field}
                className="border border-neutral-700 px-2 py-1 text-left"
              >
                <div>{col.Field}</div>
                <div className="text-[10px] text-neutral-500">
                  {col.Type}
                  {col.Key === "PRI" && " · PK"}
                  {col.Null === "NO" && " · NOT NULL"}
                </div>
              </th>
            ))}
            <th className="w-10 border border-neutral-700" />
          </tr>
        </thead>

        <tbody>
          {/* EXISTING ROWS */}
          {data.map((row, index) => {
            const rowKey = makeRowKey(row, index);
            const draft = draftRows[rowKey] || row;
            const isDirty = dirtyRows.has(rowKey);

            return (
              <tr
                key={rowKey}
                className={`border-b border-neutral-800 ${
                  isDirty ? "bg-neutral-850" : ""
                }`}
              >
                <td className="border border-neutral-800 px-2">
                  <button
                    onClick={() => {
                      const where = {};
                      pkColumns.forEach((k) => (where[k] = row[k]));
                      deleteRow(table, where);
                    }}
                    className="hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>

                {schema.map((col) => (
                  <td
                    key={col.Field}
                    className="border border-neutral-800 px-2 py-1"
                  >
                    <input
                      value={draft[col.Field] ?? ""}
                      onChange={(e) =>
                        onCellChange(rowKey, col.Field, e.target.value)
                      }
                      className={`w-full bg-transparent focus:outline-none ${
                        draft[col.Field] !== row[col.Field]
                          ? "text-yellow-300"
                          : ""
                      }`}
                    />
                  </td>
                ))}

                <td className="border border-neutral-800 text-center">
                  {isDirty && (
                    <button
                      onClick={() => saveRow(rowKey)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Save size={14} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {/* NEW ROW */}
          <tr
            className={`border-t border-neutral-800 ${
              newRowDirty ? "bg-neutral-850" : ""
            }`}
          >
            <td className="border border-neutral-800 px-2 text-neutral-600">
              <Plus size={12} />
            </td>

            {schema.map((col) => (
              <td
                key={col.Field}
                className="border border-neutral-800 px-2 py-1"
              >
                <input
                  value={newRow[col.Field] ?? ""}
                  onChange={(e) => onNewCellChange(col.Field, e.target.value)}
                  placeholder={`New ${col.Field}`}
                  className="w-full bg-transparent focus:outline-none"
                />
              </td>
            ))}

            <td className="border border-neutral-800 text-center">
              {newRowDirty && (
                <button
                  onClick={saveNewRow}
                  className="text-green-400 hover:text-green-300"
                >
                  <Save size={14} />
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
