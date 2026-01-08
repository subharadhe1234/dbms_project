import { useState } from "react";

export default function EditableCell({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const commit = () => {
    setEditing(false);
    if (temp !== value) {
      onSave(temp);
    }
  };

  return editing ? (
    <input
      autoFocus
      value={temp}
      onChange={(e) => setTemp(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      className="w-full bg-neutral-800 border border-neutral-600
                 rounded px-2 py-1 text-neutral-100
                 focus:outline-none focus:border-neutral-400"
    />
  ) : (
    <div
      onClick={() => setEditing(true)}
      className="cursor-pointer px-2 py-1 rounded
                 hover:bg-neutral-800 text-neutral-200"
    >
      {value || <span className="text-neutral-500">NULL</span>}
    </div>
  );
}
