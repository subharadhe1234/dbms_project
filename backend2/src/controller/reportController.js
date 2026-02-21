import { db } from "../db/db.js";
import {
  course,
  student,
  enrolledIn,
  instructor,
  taughtBy,
  classifiedUnder,
  finalProject,
  academicDepartment,
} from "../db/schema/schema.js";
import { eq, and, gt, or, ilike, sql } from "drizzle-orm";

export const getFacultyContinuingEducation = async (req, res) => {
  try {
    const result = await db
      .select({
        instructorId: instructor.id,
        instructorName: instructor.name,
        studentId: student.id,
        aadhaarNo: instructor.aadhaarNo,
        dob: instructor.dob,
      })
      .from(instructor)
      .innerJoin(student, eq(instructor.aadhaarNo, student.aadhaarNo));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate faculty continuing education report",
    });
  }
};

export const getTeachingLoadReport = async (req, res) => {
  try {
    const result = await db
      .select({
        departmentId: academicDepartment.id,
        departmentName: academicDepartment.name,

        totalCourses: sql`COUNT(DISTINCT ${course.id})`,
        totalInstructors: sql`COUNT(DISTINCT ${taughtBy.instructorId})`,
        totalStudents: sql`COUNT(DISTINCT ${enrolledIn.studentId})`,
      })
      .from(academicDepartment)
      .leftJoin(course, eq(course.departmentId, academicDepartment.id))
      .leftJoin(taughtBy, eq(taughtBy.courseId, course.id))
      .leftJoin(enrolledIn, eq(enrolledIn.courseId, course.id))
      .groupBy(academicDepartment.id);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate teaching load report",
    });
  }
};

export const getHighAchieversReport = async (req, res) => {
  try {
    const result = await db
      .select({
        studentName: student.name,
        studentId: student.id,
        courseTitle: course.title,
        grade: enrolledIn.grade,
        projectTitle: finalProject.title,
      })
      .from(finalProject)
      .innerJoin(enrolledIn, eq(finalProject.enrollmentId, enrolledIn.id))
      .innerJoin(student, eq(enrolledIn.studentId, student.id))
      .innerJoin(course, eq(enrolledIn.courseId, course.id))
      .where(
        and(
          //   eq(finalProject.isNotable, true),
          eq(enrolledIn.grade, "A"),
        ),
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to generate high achievers report",
    });
  }
};
