import { useState } from "react";
import { useParams } from "react-router-dom";

const CoursePage = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("students");

  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">Course ID: {courseId}</h2>

      {/* TABS */}
      <div className="flex gap-4 mb-4">
        {["students", "teachers", "projects"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border rounded ${
              activeTab === tab ? "bg-black text-white" : "bg-white"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="border rounded p-4">
        {activeTab === "students" && <div>Student list goes here</div>}
        {activeTab === "teachers" && <div>Teacher list goes here</div>}
        {activeTab === "projects" && <div>Project list goes here</div>}
      </div>
    </div>
  );
};

export default CoursePage;
