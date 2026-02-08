ALTER TABLE "instructor" ADD COLUMN "aadhaar_no" varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE "student" ADD COLUMN "aadhaar_no" varchar(12) NOT NULL;--> statement-breakpoint
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_aadhaar_no_unique" UNIQUE("aadhaar_no");--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_aadhaar_no_unique" UNIQUE("aadhaar_no");