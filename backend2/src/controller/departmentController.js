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
import { eq, and, gt, or, ilike } from "drizzle-orm";

export const getDepartment = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);

    if (isNaN(departmentId)) {
      return res.status(400).json({ message: "Invalid department id" });
    }

    const [department] = await db
      .select()
      .from(academicDepartment)
      .where(eq(academicDepartment.id, departmentId));

    return res.status(200).json(department);
  } catch (error) {
    console.error("getDepartment error ", error);
    res.status(500).json({ message: "Failed to fetch department" });
  }
};

// courses
export const getCoursesByDepartment = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);

    if (isNaN(departmentId)) {
      return res.status(400).json({ message: "Invalid department id" });
    }

    const rows = await db
      .select({
        courseId: course.id,
        title: course.title,
        year: course.year,
        duration: course.duration,
        syllabus: course.syllabus,
        subjectName: classifiedUnder.subjectName,
      })
      .from(course)
      .leftJoin(classifiedUnder, eq(course.id, classifiedUnder.courseId))
      .where(eq(course.departmentId, departmentId));

    const courseMap = {};

    for (const row of rows) {
      if (!courseMap[row.courseId]) {
        courseMap[row.courseId] = {
          id: row.courseId,
          title: row.title,
          year: row.year,
          duration: row.duration,
          syllabus: row.syllabus,
          subjectAreas: [],
        };
      }

      if (row.subjectName) {
        courseMap[row.courseId].subjectAreas.push(row.subjectName);
      }
    }

    res.status(200).json(Object.values(courseMap));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

export const addCourseToDepartment = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);
    const { title, year, duration, syllabus, subjectAreas } = req.body;

    if (
      !title ||
      !year ||
      !duration ||
      !syllabus ||
      !Array.isArray(subjectAreas)
    ) {
      return res.status(400).json({
        message: "All fields including subjectAreas are required",
      });
    }

    // Insert course
    const [newCourse] = await db
      .insert(course)
      .values({
        title,
        year,
        duration,
        syllabus,
        departmentId,
      })
      .returning();

    //Insert subject mappings
    if (subjectAreas.length > 0) {
      await db.insert(classifiedUnder).values(
        subjectAreas.map((name) => ({
          courseId: newCourse.id,
          subjectName: name,
        })),
      );
    }

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error(error);

    // FK violation (invalid subject name)
    if (error.cause.code === "23503") {
      return res.status(400).json({
        message: "Invalid subject area",
      });
    }

    if (error.cause.code === "23505") {
      return res.status(409).json({
        message:
          "Course with this title and year already exists in this department",
      });
    }

    res.status(500).json({ message: "Failed to create course" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);
    const courseId = Number(req.params.courseId);
    const { title, year, duration, syllabus, subjectAreas } = req.body;

    const [updatedCourse] = await db
      .update(course)
      .set({
        title,
        year,
        duration,
        syllabus,
      })
      .where(
        and(eq(course.id, courseId), eq(course.departmentId, departmentId)),
      )
      .returning();

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    /* -----------------------------
       REPLACE SUBJECT AREAS
    ----------------------------- */
    if (Array.isArray(subjectAreas)) {
      await db
        .delete(classifiedUnder)
        .where(eq(classifiedUnder.courseId, courseId));

      if (subjectAreas.length > 0) {
        await db.insert(classifiedUnder).values(
          subjectAreas.map((name) => ({
            courseId,
            subjectName: name,
          })),
        );
      }
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    // console.log(error.cause);

    if (error.code === "23505" || error?.cause?.code === "23505") {
      return res.status(409).json({
        message:
          "Course with this title and year already exists in this department",
      });
    }

    // FK violation (invalid subject name)
    if (error.cause.code === "23503") {
      return res.status(400).json({
        message: "Invalid subject area provided",
      });
    }

    res.status(500).json({ message: "Failed to update course " });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);
    const courseId = Number(req.params.courseId);

    const [deletedCourse] = await db
      .delete(course)
      .where(
        and(eq(course.id, courseId), eq(course.departmentId, departmentId)),
      )
      .returning();

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};

//student

export const getStudentByAadhaar = async (req, res) => {
  try {
    const { aadhaar } = req.query;
    const courseId = Number(req.params.courseId);

    if (!aadhaar) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required",
      });
    }
    if (!/^[0-9]{12}$/.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must be exactly 12 digits",
      });
    }
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    let studentResult = await db
      .select()
      .from(student)
      .where(eq(student.aadhaarNo, aadhaar))
      .limit(1);

    if (studentResult.length === 0) {
      const instructorResult = await db
        .select()
        .from(instructor)
        .where(eq(instructor.aadhaarNo, aadhaar))
        .limit(1);

      if (instructorResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No person found with this Aadhaar",
        });
      }

      const instructorData = instructorResult[0];

      const [newStudent] = await db
        .insert(student)
        .values({
          name: instructorData.name,
          dob: instructorData.dob,
          aadhaarNo: instructorData.aadhaarNo,
        })
        .returning();

      studentResult = [newStudent];
    }

    const studentData = studentResult[0];

    const enrolled = await db
      .select()
      .from(enrolledIn)
      .where(
        and(
          eq(enrolledIn.courseId, courseId),
          eq(enrolledIn.studentId, studentData.id),
        ),
      );

    if (enrolled.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    return res.status(200).json({
      success: true,
      data: studentData,
    });
  } catch (error) {
    console.error("Error searching student:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const assignNewStudentToCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { name, dob, aadhaarNo, grade } = req.body;

    if (!name || !dob || !aadhaarNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    const dobDate = new Date(dob);
    const today = new Date();

    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    if (dobDate >= today) {
      return res
        .status(400)
        .json({ message: "Date of birth must be in the past" });
    }

    const existingCourse = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId));

    if (existingCourse.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingStudent = await db
      .select()
      .from(student)
      .where(eq(student.aadhaarNo, aadhaarNo));

    if (existingStudent.length !== 0) {
      return res
        .status(409)
        .json({ message: "Student with this Aadhaar already exists" });
    }

    // Create student
    const [newStudent] = await db
      .insert(student)
      .values({
        name,
        dob: dobDate,
        aadhaarNo,
      })
      .returning();

    //  Enroll student into course
    const [enrollment] = await db
      .insert(enrolledIn)
      .values({
        studentId: newStudent.id,
        courseId,
        grade,
      })
      .returning();

    res.status(201).json({
      message: "Student enrolled successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to enroll student" });
  }
};

export const assignExistingStudentToCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { studentId, grade } = req.body;

    if (isNaN(courseId) || !studentId) {
      return res
        .status(400)
        .json({ message: "courseId, studentId and grade are required" });
    }

    const existingCourse = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId));

    if (existingCourse.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingStudent = await db
      .select()
      .from(student)
      .where(eq(student.id, studentId));

    if (existingStudent.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const alreadyEnrolled = await db
      .select()
      .from(enrolledIn)
      .where(
        and(
          eq(enrolledIn.courseId, courseId),
          eq(enrolledIn.studentId, studentId),
        ),
      );

    if (alreadyEnrolled.length > 0) {
      return res
        .status(409)
        .json({ message: "Student is already enrolled in this course" });
    }

    const [enrollment] = await db
      .insert(enrolledIn)
      .values({
        courseId,
        studentId,
        grade,
      })
      .returning();

    res.status(201).json({
      message: "Student assigned to course successfully",
      enrollment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign student to course" });
  }
};

export const getStudentsByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;
    const PAGE_SIZE = 10;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    let query = db
      .select({
        id: student.id,
        name: student.name,
        aadhaarNo: student.aadhaarNo,
        dob: student.dob,
        grade: enrolledIn.grade,
        enrollmentId: enrolledIn.id,
      })
      .from(enrolledIn)
      .innerJoin(student, eq(enrolledIn.studentId, student.id))
      .where(eq(enrolledIn.courseId, courseId))
      .limit(PAGE_SIZE);

    if (cursor) {
      query = db
        .select({
          id: student.id,
          name: student.name,
          aadhaarNo: student.aadhaarNo,
          dob: student.dob,
          grade: enrolledIn.grade,
          enrollmentId: enrolledIn.id,
        })
        .from(enrolledIn)
        .innerJoin(student, eq(enrolledIn.studentId, student.id))
        .where(and(eq(enrolledIn.courseId, courseId), gt(student.id, cursor)))
        .limit(PAGE_SIZE);
    }

    const students = await query;

    return res.status(200).json({
      success: true,
      data: students,
      nextCursor: students.length > 0 ? students[students.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const searchStudentsInCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const q = req.query.q?.trim();

    if (!courseId || !q) {
      return res.status(400).json({
        success: false,
        message: "Course ID and search query are required",
      });
    }

    const students = await db
      .select({
        id: student.id,
        name: student.name,
        aadhaarNo: student.aadhaarNo,
        dob: student.dob,
        grade: enrolledIn.grade,
        enrollmentId: enrolledIn.id,
      })
      .from(enrolledIn)
      .innerJoin(student, eq(enrolledIn.studentId, student.id))
      .where(
        and(
          eq(enrolledIn.courseId, courseId),
          or(
            ilike(student.name, `%${q}%`),
            eq(student.aadhaarNo, q),
            eq(student.id, Number(q) || 0),
          ),
        ),
      )
      .limit(20);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStudentDetails = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    const { name, dob, aadhaarNo, grade } = req.body;

    if (isNaN(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }

    const existingStudent = await db
      .select()
      .from(student)
      .where(eq(student.id, studentId))
      .limit(1);

    if (existingStudent.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentStudent = existingStudent[0];

    /* ================= DOB VALIDATION ================= */

    let dobDate;
    if (dob !== undefined) {
      dobDate = new Date(dob);

      if (isNaN(dobDate.getTime())) {
        return res.status(400).json({ message: "Invalid date of birth" });
      }

      if (dobDate >= new Date()) {
        return res.status(400).json({
          message: "Date of birth must be in the past",
        });
      }
    }

    /* ================= GLOBAL AADHAAR VALIDATION ================= */

    if (aadhaarNo !== undefined) {
      if (!/^[0-9]{12}$/.test(aadhaarNo)) {
        return res.status(400).json({
          message: "Aadhaar must be exactly 12 digits",
        });
      }

      if (aadhaarNo !== currentStudent.aadhaarNo) {
        // Check student table
        const conflictStudent = await db
          .select()
          .from(student)
          .where(eq(student.aadhaarNo, aadhaarNo));

        if (conflictStudent.length > 0) {
          return res.status(409).json({
            message: "Aadhaar already exists in student table",
          });
        }

        //  Check instructor table also
        const conflictInstructor = await db
          .select()
          .from(instructor)
          .where(eq(instructor.aadhaarNo, aadhaarNo));

        if (conflictInstructor.length > 0) {
          return res.status(409).json({
            message:
              "Aadhaar already exists in instructor table. Identity conflict.",
          });
        }
      }
    }

    /* ================= UPDATE DATA ================= */

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (dob !== undefined) updateData.dob = dobDate;
    if (aadhaarNo !== undefined) updateData.aadhaarNo = aadhaarNo;

    if (Object.keys(updateData).length > 0) {
      await db.update(student).set(updateData).where(eq(student.id, studentId));

      /*ALSO SYNC INSTRUCTOR TABLE */

      await db
        .update(instructor)
        .set(updateData)
        .where(eq(instructor.aadhaarNo, currentStudent.aadhaarNo));
    }
    /* ================= UPDATE GRADE ================= */

    if (grade !== undefined && !isNaN(courseId)) {
      await db
        .update(enrolledIn)
        .set({ grade })
        .where(
          and(
            eq(enrolledIn.studentId, studentId),
            eq(enrolledIn.courseId, courseId),
          ),
        );
    }

    res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error(error);

    if (error?.cause?.code === "23505") {
      return res.status(409).json({
        message: "Aadhaar number already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update student",
    });
  }
};

export const removeStudentFromCourse = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);

    if (!studentId || !courseId) {
      return res.status(400).json({
        message: "Student ID and Course ID required",
      });
    }

    const enrollment = await db
      .select()
      .from(enrolledIn)
      .where(
        and(
          eq(enrolledIn.studentId, studentId),
          eq(enrolledIn.courseId, courseId),
        ),
      );

    if (enrollment.length === 0) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    const enrollmentId = enrollment[0].id;

    const project = await db
      .select()
      .from(finalProject)
      .where(eq(finalProject.enrollmentId, enrollmentId));

    if (project.length > 0) {
      return res.status(409).json({
        message: "Cannot remove student. Final project already submitted.",
      });
    }

    await db.delete(enrolledIn).where(eq(enrolledIn.id, enrollmentId));

    res.status(200).json({
      message: "Student removed from course successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove student",
    });
  }
};

//instructor

export const getInstructorByAadhaar = async (req, res) => {
  try {
    const { aadhaar } = req.query;
    const courseId = Number(req.params.courseId);

    if (!aadhaar) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number is required",
      });
    }

    if (!/^[0-9]{12}$/.test(aadhaar)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar must be exactly 12 digits",
      });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course id",
      });
    }

    let instructorResult = await db
      .select()
      .from(instructor)
      .where(eq(instructor.aadhaarNo, aadhaar))
      .limit(1);

    if (instructorResult.length === 0) {
      const studentResult = await db
        .select()
        .from(student)
        .where(eq(student.aadhaarNo, aadhaar))
        .limit(1);

      if (studentResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No person found with this Aadhaar",
        });
      }

      const studentData = studentResult[0];

      const [newInstructor] = await db
        .insert(instructor)
        .values({
          name: studentData.name,
          dob: studentData.dob,
          aadhaarNo: studentData.aadhaarNo,
        })
        .returning();

      instructorResult = [newInstructor];
    }

    const instructorData = instructorResult[0];

    const alreadyAssigned = await db
      .select()
      .from(taughtBy)
      .where(
        and(
          eq(taughtBy.courseId, courseId),
          eq(taughtBy.instructorId, instructorData.id),
        ),
      );

    if (alreadyAssigned.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Instructor already assigned to this course",
      });
    }

    return res.status(200).json({
      success: true,
      data: instructorData,
    });
  } catch (error) {
    console.error("Error searching instructor:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const assignNewInstructorToCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { name, dob, aadhaarNo } = req.body;

    if (!name || !dob || !aadhaarNo) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime()) || dobDate >= new Date()) {
      return res.status(400).json({
        message: "Invalid date of birth",
      });
    }

    const existingInstructor = await db
      .select()
      .from(instructor)
      .where(eq(instructor.aadhaarNo, aadhaarNo));

    if (existingInstructor.length > 0) {
      return res.status(409).json({
        message: "Instructor with this Aadhaar already exists",
      });
    }

    const [newInstructor] = await db
      .insert(instructor)
      .values({
        name,
        dob: dobDate,
        aadhaarNo,
      })
      .returning();

    await db.insert(taughtBy).values({
      courseId,
      instructorId: newInstructor.id,
    });

    res.status(201).json({
      message: "Instructor added and assigned successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to assign instructor",
    });
  }
};

export const assignExistingInstructorToCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    const { instructorId } = req.body;

    const existingInstructor = await db
      .select()
      .from(instructor)
      .where(eq(instructor.id, instructorId));

    if (existingInstructor.length === 0) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    const alreadyAssigned = await db
      .select()
      .from(taughtBy)
      .where(
        and(
          eq(taughtBy.courseId, courseId),
          eq(taughtBy.instructorId, instructorId),
        ),
      );

    if (alreadyAssigned.length > 0) {
      return res.status(409).json({
        message: "Instructor already assigned",
      });
    }

    await db.insert(taughtBy).values({
      courseId,
      instructorId,
    });

    res.status(201).json({
      message: "Instructor assigned successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to assign instructor",
    });
  }
};

export const getInstructorsByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    const instructors = await db
      .select({
        id: instructor.id,
        name: instructor.name,
        aadhaarNo: instructor.aadhaarNo,
        dob: instructor.dob,
      })
      .from(taughtBy)
      .innerJoin(instructor, eq(taughtBy.instructorId, instructor.id))
      .where(eq(taughtBy.courseId, courseId));

    res.status(200).json({
      data: instructors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch instructors",
    });
  }
};

export const updateInstructorDetails = async (req, res) => {
  try {
    const instructorId = Number(req.params.instructorId);
    const { name, dob, aadhaarNo } = req.body;

    if (isNaN(instructorId)) {
      return res.status(400).json({
        message: "Invalid instructor id",
      });
    }

    /* ================= FIND INSTRUCTOR ================= */

    const existing = await db
      .select()
      .from(instructor)
      .where(eq(instructor.id, instructorId))
      .limit(1);

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Instructor not found",
      });
    }

    const currentInstructor = existing[0];

    /* ================= PREPARE UPDATE ================= */

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    /* ================= DOB VALIDATION ================= */

    if (dob !== undefined) {
      const dobDate = new Date(dob);

      if (isNaN(dobDate.getTime()) || dobDate >= new Date()) {
        return res.status(400).json({
          message: "Invalid date of birth",
        });
      }

      updateData.dob = dobDate;
    }

    /* ================= GLOBAL AADHAAR VALIDATION ================= */

    if (aadhaarNo !== undefined) {
      if (!/^[0-9]{12}$/.test(aadhaarNo)) {
        return res.status(400).json({
          message: "Aadhaar must be exactly 12 digits",
        });
      }

      if (aadhaarNo !== currentInstructor.aadhaarNo) {
        // Check instructor table conflict
        const conflictInstructor = await db
          .select()
          .from(instructor)
          .where(eq(instructor.aadhaarNo, aadhaarNo));

        if (conflictInstructor.length > 0) {
          return res.status(409).json({
            message: "Aadhaar already exists in instructor table",
          });
        }

        // Check student table conflict also
        const conflictStudent = await db
          .select()
          .from(student)
          .where(eq(student.aadhaarNo, aadhaarNo));

        if (conflictStudent.length > 0) {
          return res.status(409).json({
            message:
              "Aadhaar already exists in student table. Identity conflict.",
          });
        }
      }

      updateData.aadhaarNo = aadhaarNo;
    }

    /* ================= NO FIELD CHECK ================= */

    if (Object.keys(updateData).length > 0) {
      await db
        .update(student)
        .set(updateData)
        .where(eq(student.aadhaarNo, currentInstructor.aadhaarNo));

      await db
        .update(instructor)
        .set(updateData)
        .where(eq(instructor.id, instructorId));
    }

    res.status(200).json({
      message: "Instructor updated successfully",
    });
  } catch (error) {
    console.error(error);

    if (error?.cause?.code === "23505") {
      return res.status(409).json({
        message: "Aadhaar already exists",
      });
    }

    res.status(500).json({
      message: "Failed to update instructor",
    });
  }
};

export const removeInstructorFromCourse = async (req, res) => {
  try {
    const instructorId = Number(req.params.instructorId);
    const courseId = Number(req.params.courseId);

    const existing = await db
      .select()
      .from(taughtBy)
      .where(
        and(
          eq(taughtBy.courseId, courseId),
          eq(taughtBy.instructorId, instructorId),
        ),
      );

    if (existing.length === 0) {
      return res.status(404).json({
        message: "Assignment not found",
      });
    }

    await db
      .delete(taughtBy)
      .where(
        and(
          eq(taughtBy.courseId, courseId),
          eq(taughtBy.instructorId, instructorId),
        ),
      );

    res.status(200).json({
      message: "Instructor removed from course successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to remove instructor",
    });
  }
};

//final projects
export const getFinalProjectsByCourse = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    /* Check course exists */
    const existingCourse = await db
      .select()
      .from(course)
      .where(eq(course.id, courseId));

    if (existingCourse.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    /* Fetch final projects with student details */
    const projects = await db
      .select({
        projectId: finalProject.id,
        title: finalProject.title,
        description: finalProject.description,
        studentId: student.id,
        studentName: student.name,
        studentDob: student.dob,
        aadhaarNo: student.aadhaarNo,
      })
      .from(finalProject)
      .innerJoin(enrolledIn, eq(finalProject.enrollmentId, enrolledIn.id))
      .innerJoin(student, eq(enrolledIn.studentId, student.id))
      .where(eq(enrolledIn.courseId, courseId));

    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch final projects" });
  }
};

export const getFinalProjectByEnrollmentId = async (req, res) => {
  try {
    const enrollmentId = Number(req.params.enrollmentId);

    /* ================= VALIDATION ================= */

    if (isNaN(enrollmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enrollment id",
      });
    }

    /* ================= CHECK ENROLLMENT EXISTS ================= */

    const enrollment = await db
      .select()
      .from(enrolledIn)
      .where(eq(enrolledIn.id, enrollmentId))
      .limit(1);

    if (enrollment.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    /* ================= FETCH FINAL PROJECT ================= */

    const project = await db
      .select({
        projectId: finalProject.id,
        title: finalProject.title,
        description: finalProject.description,
        enrollmentId: finalProject.enrollmentId,
      })
      .from(finalProject)
      .where(eq(finalProject.enrollmentId, enrollmentId))
      .limit(1);

    if (project.length === 0) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: project[0],
    });
  } catch (error) {
    console.error("Error fetching final project:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch final project",
    });
  }
};

export const addFinalProject = async (req, res) => {
  try {
    const enrollmentId = Number(req.params.enrollmentId);
    const { title, description } = req.body;

    if (!title || !description || isNaN(enrollmentId)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    /* Check enrollment exists */
    const enrollment = await db
      .select()
      .from(enrolledIn)
      .where(eq(enrolledIn.id, enrollmentId));

    if (enrollment.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    /* Check project already exists */
    const existingProject = await db
      .select()
      .from(finalProject)
      .where(eq(finalProject.enrollmentId, enrollmentId));

    if (existingProject.length > 0) {
      return res.status(409).json({
        message: "Final project already exists for this enrollment",
      });
    }

    const [newProject] = await db
      .insert(finalProject)
      .values({
        enrollmentId,
        title,
        description,
      })
      .returning();

    res.status(201).json({
      message: "Final project added successfully",
      project: newProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add final project" });
  }
};

export const updateFinalProject = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);
    const { title, description } = req.body;

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    /* Check project exists */
    const existingProject = await db
      .select()
      .from(finalProject)
      .where(eq(finalProject.id, projectId));

    if (existingProject.length === 0) {
      return res.status(404).json({ message: "Final project not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const [updatedProject] = await db
      .update(finalProject)
      .set(updateData)
      .where(eq(finalProject.id, projectId))
      .returning();

    res.status(200).json({
      message: "Final project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update final project" });
  }
};

export const deleteFinalProject = async (req, res) => {
  try {
    const projectId = Number(req.params.projectId);

    if (isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    /* Check project exists */
    const existingProject = await db
      .select()
      .from(finalProject)
      .where(eq(finalProject.id, projectId));

    if (existingProject.length === 0) {
      return res.status(404).json({ message: "Final project not found" });
    }

    /* Delete project */
    await db.delete(finalProject).where(eq(finalProject.id, projectId));

    res.status(200).json({
      message: "Final project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete final project" });
  }
};
