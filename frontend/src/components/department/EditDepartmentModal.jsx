import React from "react";
import { X, Mail, MapPin, Building2, Loader2, Save } from "lucide-react";

const EditDepartmentModal = ({
  open,
  department,
  formData,
  onChange,
  onSubmit,
  onClose,
  loading = false, // Added loading prop
}) => {
  if (!open || !department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* GLASSMORPHISM BACKDROP */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* MODAL CARD */}
      <div className="relative bg-white w-full max-w-[440px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
        {/* HEADER SECTION */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Edit Department
              </h2>
              <p className="text-sm text-gray-500">
                Updating{" "}
                <span className="text-black font-semibold px-1.5 py-0.5 bg-gray-100 rounded-md">
                  {department.name}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-full text-gray-400 hover:text-gray-900 transition-all disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* FORM SECTION */}
        <form onSubmit={onSubmit} className="p-8 space-y-6">
          {/* DEPARTMENT NAME */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Department Name
            </label>
            <div className="relative group">
              <Building2
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                disabled={loading}
                className="w-full bg-gray-50 border-gray-200 border pl-12 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-400
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
                placeholder="e.g. Engineering"
                required
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
              Location
            </label>
            <div className="relative group">
              <MapPin
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onChange}
                disabled={loading}
                className="w-full bg-gray-50 border-gray-200 border pl-12 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-400
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
                placeholder="e.g. San Francisco, CA"
                required
              />
            </div>
          </div>

          {/* DEPARTMENT EMAIL */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Department Email
              </label>
              <span className="text-[10px] text-gray-400 italic">Optional</span>
            </div>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                size={18}
              />
              <input
                type="email"
                name="managerEmail"
                value={formData.managerEmail}
                onChange={onChange}
                disabled={loading}
                className="w-full bg-gray-50 border-gray-200 border pl-12 pr-4 py-3 rounded-2xl
                           text-gray-900 placeholder:text-gray-400
                           focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black
                           transition-all outline-none disabled:opacity-60"
                placeholder="dept@company.com"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 
                         hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-[1.5] relative flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold
                         rounded-2xl hover:bg-gray-800 active:scale-[0.97] 
                         transition-all shadow-xl shadow-black/10 disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
