CREATE TABLE `user`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `user` ADD UNIQUE `user_email_unique`(`email`);
CREATE TABLE `academic_department`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `location` TEXT NOT NULL
);
ALTER TABLE
    `academic_department` ADD UNIQUE `academic_department_name_unique`(`name`);
CREATE TABLE `course`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `year` INT UNSIGNED NOT NULL,
    `duration` INT UNSIGNED NOT NULL,
    `syllabus` TEXT NOT NULL,
    `department_id` INT NOT NULL
);
ALTER TABLE
    `course` ADD UNIQUE `course_title_unique`(`title`);
ALTER TABLE
    `course` ADD UNIQUE `course_year_unique`(`year`);
CREATE TABLE `subject_area`(
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`name`)
);
CREATE TABLE `classified_under`(
    `course_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`name`)
);
CREATE TABLE `instructor`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `dob` DATETIME NOT NULL
);
CREATE TABLE `student`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `dob` DATETIME NOT NULL
);
CREATE TABLE `taught_by`(
    `course_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `instructor_id` INT NOT NULL,
    PRIMARY KEY(`instructor_id`)
);
CREATE TABLE `enrolled_in`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `course_id` INT NOT NULL,
    `student_id` INT NOT NULL,
    `grade` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `enrolled_in` ADD UNIQUE `enrolled_in_course_id_unique`(`course_id`);
ALTER TABLE
    `enrolled_in` ADD UNIQUE `enrolled_in_student_id_unique`(`student_id`);
CREATE TABLE `final_project`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `enrollment_id` INT NOT NULL,
    `tittle` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL
);
ALTER TABLE
    `final_project` ADD UNIQUE `final_project_enrollment_id_unique`(`enrollment_id`);
ALTER TABLE
    `classified_under` ADD CONSTRAINT `classified_under_name_foreign` FOREIGN KEY(`name`) REFERENCES `subject_area`(`name`);
ALTER TABLE
    `taught_by` ADD CONSTRAINT `taught_by_instructor_id_foreign` FOREIGN KEY(`instructor_id`) REFERENCES `instructor`(`id`);
ALTER TABLE
    `classified_under` ADD CONSTRAINT `classified_under_course_id_foreign` FOREIGN KEY(`course_id`) REFERENCES `course`(`id`);
ALTER TABLE
    `enrolled_in` ADD CONSTRAINT `enrolled_in_student_id_foreign` FOREIGN KEY(`student_id`) REFERENCES `student`(`id`);
ALTER TABLE
    `course` ADD CONSTRAINT `course_department_id_foreign` FOREIGN KEY(`department_id`) REFERENCES `academic_department`(`id`);
ALTER TABLE
    `taught_by` ADD CONSTRAINT `taught_by_course_id_foreign` FOREIGN KEY(`course_id`) REFERENCES `course`(`id`);
ALTER TABLE
    `final_project` ADD CONSTRAINT `final_project_enrollment_id_foreign` FOREIGN KEY(`enrollment_id`) REFERENCES `enrolled_in`(`id`);
ALTER TABLE
    `enrolled_in` ADD CONSTRAINT `enrolled_in_course_id_foreign` FOREIGN KEY(`course_id`) REFERENCES `course`(`id`);