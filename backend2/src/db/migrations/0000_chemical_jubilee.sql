CREATE TABLE "academic_department" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"location" text NOT NULL,
	CONSTRAINT "academic_department_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "classified_under" (
	"course_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "classified_under_pk" UNIQUE("course_id","name")
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"year" integer NOT NULL,
	"duration" integer NOT NULL,
	"syllabus" text NOT NULL,
	"department_id" integer NOT NULL,
	CONSTRAINT "course_title_year_unique" UNIQUE("title","year")
);
--> statement-breakpoint
CREATE TABLE "enrolled_in" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"grade" varchar(255) NOT NULL,
	CONSTRAINT "enrolled_in_unique" UNIQUE("course_id","student_id")
);
--> statement-breakpoint
CREATE TABLE "final_project" (
	"id" serial PRIMARY KEY NOT NULL,
	"enrollment_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "final_project_enrollment_id_unique" UNIQUE("enrollment_id")
);
--> statement-breakpoint
CREATE TABLE "instructor" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"dob" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject_area" (
	"name" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "taught_by" (
	"course_id" integer NOT NULL,
	"instructor_id" integer NOT NULL,
	CONSTRAINT "taught_by_pk" UNIQUE("course_id","instructor_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "classified_under" ADD CONSTRAINT "classified_under_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classified_under" ADD CONSTRAINT "classified_under_name_subject_area_name_fk" FOREIGN KEY ("name") REFERENCES "public"."subject_area"("name") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_department_id_academic_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."academic_department"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrolled_in" ADD CONSTRAINT "enrolled_in_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrolled_in" ADD CONSTRAINT "enrolled_in_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "final_project" ADD CONSTRAINT "final_project_enrollment_id_enrolled_in_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrolled_in"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taught_by" ADD CONSTRAINT "taught_by_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taught_by" ADD CONSTRAINT "taught_by_instructor_id_instructor_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructor"("id") ON DELETE restrict ON UPDATE no action;