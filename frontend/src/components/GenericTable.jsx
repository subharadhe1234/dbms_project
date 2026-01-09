import { Trash2, Save, Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
  } = useDB();

  /* ===============================
     PRIMARY KEY DETECTION (COMPOSITE SAFE)
     =============================== */
  const pkColumns = schema.filter((c) => c.Key === "PRI").map((c) => c.Field);

  /* Stable composite row identity (based on ORIGINAL PK) */
  const makeRowKey = (row) =>
    pkColumns.length
      ? pkColumns.map((k) => row[k]).join("::")
      : JSON.stringify(row);

  /* ===============================
     STATE
     =============================== */
  const [draftRows, setDraftRows] = useState({});
  const [originalRows, setOriginalRows] = useState({});
  const [dirtyRows, setDirtyRows] = useState(new Set());

  const [newRow, setNewRow] = useState({});
  const [newRowDirty, setNewRowDirty] = useState(false);

  /* ===============================
     LOAD SCHEMA + DATA
     =============================== */
  useEffect(() => {
    fetchSchema(table);
    fetchTableData(table);
    // console.log(schema);
    // console.log(data);
  }, [table]);

  /* ===============================
     SYNC DATA → DRAFT + ORIGINAL SNAPSHOT
     =============================== */
  useEffect(() => {
    const draftMap = {};
    const originalMap = {};

    data.forEach((r) => {
      const key = makeRowKey(r);
      draftMap[key] = { ...r };
      originalMap[key] = { ...r };
    });

    setDraftRows(draftMap);
    setOriginalRows(originalMap);
    setDirtyRows(new Set());
  }, [data, schema]);

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
     - WHERE → OLD PK
     - SET   → NEW VALUES (including PK)
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

        {/* ================= BODY ================= */}
        <tbody>
          {/* EXISTING ROWS */}
          {data.map((row) => {
            const rowKey = makeRowKey(row);
            const draft = draftRows[rowKey] || row;
            const isDirty = dirtyRows.has(rowKey);

            return (
              <tr
                key={rowKey}
                className={`border-b border-neutral-800 ${
                  isDirty ? "bg-neutral-850" : ""
                }`}
              >
                {/* DELETE */}
                <td className="border border-neutral-800 px-2 text-neutral-500">
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

                {/* CELLS */}
                {schema.map((col) => {
                  const field = col.Field;
                  return (
                    <td
                      key={field}
                      className="border border-neutral-800 px-2 py-1"
                    >
                      <input
                        value={draft[field] ?? ""}
                        onChange={(e) =>
                          onCellChange(rowKey, field, e.target.value)
                        }
                        className={`w-full bg-transparent focus:outline-none ${
                          draft[field] !== row[field] ? "text-yellow-300" : ""
                        }`}
                      />
                    </td>
                  );
                })}

                {/* SAVE */}
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

          {/* ================= NEW ROW ================= */}
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
                  className={`w-full bg-transparent focus:outline-none ${
                    newRowDirty ? "text-yellow-300" : ""
                  }`}
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
