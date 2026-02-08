import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Layers, MapPin } from "lucide-react";

import Navbar from "../components/Navbar";
import AddDepartmentModal from "../components/department/AddDepartmentModal";
import EditDepartmentModal from "../components/department/EditDepartmentModal";
import SubjectAreaModal from "../components/department/SubjectAreaModal";

import { useDepartment } from "../context/DepartmentContext";

/* =========================
   CONSTANTS
========================= */
const EMPTY_FORM = {
  name: "",
  location: "",
  managerEmail: "",
};

const DepartmentSelector = () => {
  const navigate = useNavigate();

  const { departments, createDepartment, updateDepartment, loading } =
    useDepartment();

  const [addOpen, setAddOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- ADD ---------- */
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setAddOpen(true);
  };

  const closeAdd = () => {
    setAddOpen(false);
    setFormData(EMPTY_FORM);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    await createDepartment({
      name: formData.name.trim(),
      location: formData.location.trim(),
      managerEmail: formData.managerEmail || null,
    });

    closeAdd();
  };

  /* ---------- EDIT ---------- */
  const openEdit = (dept) => {
    setEditDept(dept);
    setFormData({
      name: dept.name,
      location: dept.location,
      managerEmail: dept.managerEmail ?? "",
    });
  };

  const closeEdit = () => {
    setEditDept(null);
    setFormData(EMPTY_FORM);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    await updateDepartment(editDept.id, {
      name: formData.name.trim(),
      location: formData.location.trim(),
      managerEmail: formData.managerEmail || null,
    });

    closeEdit();
  };

  return (
    <>
      <Navbar active="home" />

      <div className="pt-28 px-8 max-w-6xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-semibold tracking-tight">Departments</h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSubjectOpen(true)}
              className="p-2 border rounded-md
                         hover:bg-black hover:text-white transition"
              title="Manage Subject Areas"
            >
              <Layers size={20} />
            </button>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2
                         bg-black text-white rounded-md
                         hover:bg-black/90 transition"
            >
              <Plus size={18} />
              Add Department
            </button>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="space-y-4" role="list">
          {departments.map((dept) => (
            <div
              key={dept.id}
              role="listitem"
              className="group relative flex items-center justify-between
                 border border-gray-200 rounded-xl px-6 py-5
                 hover:bg-gray-50 transition-colors duration-200"
            >
              <button
                onClick={() => navigate(`/department/${dept.id}`)}
                className="flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
                  {/* PRIMARY INFO */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {dept.name}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                      {dept.location}
                    </div>
                  </div>

                  {/* SECONDARY INFO (Separated) */}
                  <div className="flex items-center md:justify-start">
                    <div className="hidden md:block h-8 w-[1px] bg-gray-200 mr-8" />
                    <div>
                      <p className="text-[14px]   tracking-wider font-bold text-gray-700">
                        Department Email
                      </p>
                      <p className="text-sm py-0.5 text-gray-600 truncate">
                        {dept.managerEmail ?? "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>

              {/* ACTION */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(dept);
                }}
                className="ml-4 p-2.5 border border-gray-200 rounded-lg text-gray-400
                   opacity-0 group-hover:opacity-100 focus:opacity-100
                   hover:bg-black hover:text-white transition-all"
                title="Edit Department"
              >
                <Pencil size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <AddDepartmentModal
        open={addOpen}
        onClose={closeAdd}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleAddSubmit}
        loading={loading}
      />

      <EditDepartmentModal
        open={!!editDept}
        department={editDept}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleEditSubmit}
        onClose={closeEdit}
        loading={loading}
      />

      <SubjectAreaModal
        open={subjectOpen}
        onClose={() => setSubjectOpen(false)}
      />
    </>
  );
};

export default DepartmentSelector;
