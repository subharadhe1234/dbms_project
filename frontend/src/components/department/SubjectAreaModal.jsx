import { useState } from "react";
import { Pencil, Check, X, Plus, Loader2, BookOpen } from "lucide-react";
import { useDepartment } from "../../context/DepartmentContext";

const SubjectAreaModal = ({ open, onClose }) => {
  const { subjectAreas, addSubjectArea, updateSubjectArea, loading } =
    useDepartment();

  const [newSubject, setNewSubject] = useState("");
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  if (!open) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || loading) return;
    await addSubjectArea(newSubject.trim());
    setNewSubject("");
  };

  const startEdit = (name) => {
    setEditing(name);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editValue.trim() || editValue === editing) return cancelEdit();
    await updateSubjectArea(editing, editValue.trim());
    setEditing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={loading ? undefined : onClose}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-black rounded-lg text-white">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Subject Areas
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Add or refine categories for your curriculum.
          </p>
        </div>

        <div className="p-8">
          {/* ADD NEW SECTION */}
          <form onSubmit={handleAdd} className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add new subject..."
                disabled={loading}
                className="w-full bg-gray-50 border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newSubject.trim()}
              className="px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 
                         disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-95"
            >
              {loading && !editing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Plus size={20} />
              )}
            </button>
          </form>

          {/* LIST SECTION */}
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar mb-8">
            {subjectAreas.map((name) => {
              const isEditing = editing === name;

              return (
                <div key={name} className="relative group">
                  <div className="relative flex items-center">
                    <input
                      value={isEditing ? editValue : name}
                      onChange={(e) => setEditValue(e.target.value)}
                      disabled={!isEditing}
                      autoFocus={isEditing}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200
              ${
                isEditing
                  ? "bg-white border-black text-black ring-4 ring-black/5 shadow-md pr-20 z-10"
                  : "bg-gray-50 border-gray-100 text-gray-500 cursor-default pr-12"
              }`}
                    />

                    {/* ACTION BUTTONS CONTAINER */}
                    <div
                      className={`absolute right-2 flex items-center gap-1.5 z-20 px-1
              ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"} 
              transition-opacity duration-200`}
                    >
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              saveEdit();
                            }}
                            className="p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm"
                            title="Save"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              cancelEdit();
                            }}
                            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                            title="Cancel"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(name)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {subjectAreas.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-sm text-gray-400 italic">
                  No subject areas added yet
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 border border-gray-200 text-sm font-bold text-gray-600 
                       rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectAreaModal;
