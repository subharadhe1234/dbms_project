import React from "react";
import { X, Building2, MapPin, Mail, Plus, Loader2 } from "lucide-react";

const AddDepartmentModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  loading = false, // Added loading prop
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ANIMATED BACKDROP */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="relative bg-gray-50 px-8 pt-8 pb-6 border-b border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-white hover:text-gray-900 rounded-full transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white mb-4 shadow-lg shadow-black/20">
            <Plus size={24} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            New Department
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to expand your academic structure.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="p-8 space-y-5">
          {/* DEPARTMENT NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Department Name
            </label>
            <div className="relative group">
              <Building2
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                disabled={loading}
                placeholder="e.g. Computer Science"
                className="w-full bg-gray-50 border-gray-200 border pl-11 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-300
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Location / Building
            </label>
            <div className="relative group">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                disabled={loading}
                placeholder="e.g. Engineering Block A"
                className="w-full bg-gray-50 border-gray-200 border pl-11 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-300
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* DEPARTMENT EMAIL */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Department Email
              </label>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                Optional
              </span>
            </div>
            <div className="relative group">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="email"
                name="managerEmail"
                value={formData.managerEmail}
                onChange={onChange}
                disabled={loading}
                placeholder="cs-dept@college.edu"
                className="w-full bg-gray-50 border-gray-200 border pl-11 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-300
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 
                         hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[2] relative px-4 py-3 bg-black text-white text-sm font-bold
                         rounded-2xl hover:bg-gray-800 active:scale-[0.97] 
                         transition-all shadow-xl shadow-black/10 disabled:bg-gray-400 disabled:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Department"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
