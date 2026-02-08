import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/* =========================
   ACADEMIC DEPARTMENT
========================= */
export const academicDepartment = pgTable(
  "academic_department",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    location: text("location").notNull(),
  },
  (table) => ({
    nameUnique: unique("academic_department_name_unique").on(table.name),
  }),
);
/* =========================
   USER
========================= */
export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),

    email: varchar("email", { length: 255 }).notNull(),

    password: varchar("password", { length: 255 }).notNull(),

    departmentId: integer("department_id").references(
      () => academicDepartment.id,
      {
        onDelete: "set null",
      },
    ), // nullable by default
  },
  (table) => ({
    emailUnique: unique("user_email_unique").on(table.email),
  }),
);

/* =========================
   COURSE
========================= */
export const course = pgTable(
  "course",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    year: integer("year").notNull(),
    duration: integer("duration").notNull(),
    syllabus: text("syllabus").notNull(),
    departmentId: integer("department_id")
      .notNull()
      .references(() => academicDepartment.id, { onDelete: "restrict" }),
  },
  (table) => ({
    titleYearUnique: unique("course_title_year_unique").on(
      table.title,
      table.year,
    ),
  }),
);

/* =========================
   SUBJECT AREA
========================= */
export const subjectArea = pgTable("subject_area", {
  name: varchar("name", { length: 255 }).primaryKey(),
});

/* =========================
   CLASSIFIED UNDER (M:N)
========================= */
export const classifiedUnder = pgTable(
  "classified_under",
  {
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "restrict" }),

    subjectName: varchar("name", { length: 255 })
      .notNull()
      .references(() => subjectArea.name, { onDelete: "restrict" }),
  },
  (table) => ({
    pk: unique("classified_under_pk").on(table.courseId, table.subjectName),
  }),
);

/* =========================
   INSTRUCTOR
========================= */
export const instructor = pgTable("instructor", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dob: timestamp("dob", { mode: "date" }).notNull(),
  aadhaarNo: varchar("aadhaar_no", { length: 12 }).notNull().unique(),
});

/* =========================
   STUDENT
========================= */
export const student = pgTable("student", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  dob: timestamp("dob", { mode: "date" }).notNull(),
  aadhaarNo: varchar("aadhaar_no", { length: 12 }).notNull().unique(),
});

/* =========================
   TAUGHT BY (M:N)
========================= */
export const taughtBy = pgTable(
  "taught_by",
  {
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "restrict" }),

    instructorId: integer("instructor_id")
      .notNull()
      .references(() => instructor.id, { onDelete: "restrict" }),
  },
  (table) => ({
    pk: unique("taught_by_pk").on(table.courseId, table.instructorId),
  }),
);

/* =========================
   ENROLLED IN
========================= */
export const enrolledIn = pgTable(
  "enrolled_in",
  {
    id: serial("id").primaryKey(),

    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "restrict" }),

    studentId: integer("student_id")
      .notNull()
      .references(() => student.id, { onDelete: "restrict" }),

    grade: varchar("grade", { length: 255 }).notNull(),
  },
  (table) => ({
    enrollmentUnique: unique("enrolled_in_unique").on(
      table.courseId,
      table.studentId,
    ),
  }),
);

/* =========================
   FINAL PROJECT
========================= */
export const finalProject = pgTable(
  "final_project",
  {
    id: serial("id").primaryKey(),

    enrollmentId: integer("enrollment_id")
      .notNull()
      .references(() => enrolledIn.id, { onDelete: "restrict" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
  },
  (table) => ({
    enrollmentUnique: unique("final_project_enrollment_id_unique").on(
      table.enrollmentId,
    ),
  }),
);
