import { createContext, useContext, useState } from "react";
import * as reportApi from "../api/reportApi";

const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
  const [facultyEducation, setFacultyEducation] = useState([]);
  const [teachingLoad, setTeachingLoad] = useState([]);
  const [highAchievers, setHighAchievers] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchFacultyContinuingEducation = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getFacultyContinuingEducation();
      setFacultyEducation(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch faculty continuing education", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachingLoadReport = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getTeachingLoadReport();

      const rawData = res.data.data || [];

      //  Calculate intensity here
      const enrichedData = rawData.map((dept) => {
        const totalStudents = Number(dept.totalStudents || 0);
        const totalInstructors = Number(dept.totalInstructors || 0);
        const totalCourses = Number(dept.totalCourses || 0);

        const studentsPerInstructor =
          totalInstructors > 0
            ? (totalStudents / totalInstructors).toFixed(2)
            : 0;

        const coursesPerInstructor =
          totalInstructors > 0
            ? (totalCourses / totalInstructors).toFixed(2)
            : 0;

        const studentsPerCourse =
          totalCourses > 0 ? (totalStudents / totalCourses).toFixed(2) : 0;

        // Optional: Add intensity level
        let intensityLevel = "Low";

        if (studentsPerInstructor > 60) intensityLevel = "High";
        else if (studentsPerInstructor > 35) intensityLevel = "Medium";

        return {
          ...dept,
          studentsPerInstructor,
          coursesPerInstructor,
          studentsPerCourse,
          intensityLevel,
        };
      });

      setTeachingLoad(enrichedData);
    } catch (error) {
      console.error("Failed to fetch teaching load report", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHighAchieversReport = async () => {
    setLoading(true);
    try {
      const res = await reportApi.getHighAchieversReport();
      setHighAchievers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch high achievers", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        facultyEducation,
        teachingLoad,
        highAchievers,
        loading,

        fetchFacultyContinuingEducation,
        fetchTeachingLoadReport,
        fetchHighAchieversReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => useContext(ReportContext);
