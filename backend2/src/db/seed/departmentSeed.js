import bcrypt from "bcrypt";
import { db } from "../db.js";
import { academicDepartment, user } from "../schema/schema.js";

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    /* =========================
       HASH PASSWORD
    ========================= */
    const plainPassword = "1234";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    /* =========================
       INSERT DEPARTMENTS
    ========================= */
    const departments = await db
      .insert(academicDepartment)
      .values([
        {
          name: "Computer Science",
          location: "Block A",
        },
        {
          name: "Mechanical Engineering",
          location: "Block B",
        },
        {
          name: "Civil Engineering",
          location: "Block C",
        },
      ])
      .returning();

    console.log("✅ Departments inserted");

    /* =========================
       INSERT USERS
    ========================= */
    await db.insert(user).values([
      {
        email: "cse.admin@college.edu",
        password: hashedPassword,
        departmentId: departments[0].id,
      },
      {
        email: "mech.admin@college.edu",
        password: hashedPassword,
        departmentId: departments[1].id,
      },
      {
        email: "general.user@college.edu",
        password: hashedPassword,
        departmentId: null,
      },
    ]);

    console.log("✅ Users inserted");
    console.log("🌱 Seeding completed successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
