import { db } from "../db/db.js";
import { academicDepartment, user, subjectArea } from "../db/schema/schema.js";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcrypt";

//Departments

export const getAllDepartments = async (req, res) => {
  try {
    const result = await db
      .select({
        id: academicDepartment.id,
        name: academicDepartment.name,
        location: academicDepartment.location,
        managerEmail: user.email,
      })
      .from(academicDepartment)
      .leftJoin(user, eq(academicDepartment.id, user.departmentId));

    res.json(result);
  } catch (err) {
    console.error("getAllDepartmentsError:", err);
    res.status(500).json({
      message: "Error fetching departments",
      error: err.message,
    });
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { name, location, managerEmail } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Name and location are required",
      });
    }
    const [existingDepartment] = await db
      .select()
      .from(academicDepartment)
      .where(eq(name, academicDepartment.name));

    if (existingDepartment) {
      return res.status(400).json({
        message: "Department name already exist",
      });
    }

    //Create department
    const [department] = await db
      .insert(academicDepartment)
      .values({ name, location })
      .returning();

    let infoMessage = "Department created successfully";
    let assignedManagerEmail = null;

    // If managerEmail provided
    if (managerEmail) {
      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, managerEmail));

      if (existingUser) {
        if (existingUser.departmentId) {
          infoMessage = `Manager is already assigned to another department.`;
        } else {
          infoMessage = `This is admin email.`;
        }
      } else {
        const hashedPassword = await bcrypt.hash("1234", 10);

        await db.insert(user).values({
          email: managerEmail,
          password: hashedPassword,
          departmentId: department.id,
        });
      }
    }

    return res.status(201).json({
      ...department,
      managerEmail: assignedManagerEmail,
      message: infoMessage,
    });
  } catch (err) {
    console.error("addDepartmentError:", err);
    res.status(500).json({
      message: "Error adding departments",
      error: err.message,
    });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const departmentId = Number(req.params.departmentId);
    const { name, location, managerEmail } = req.body;

    if (!departmentId) {
      return res.status(400).json({ message: "Invalid department id" });
    }

    //  Check department exists
    const [department] = await db
      .select()
      .from(academicDepartment)
      .where(eq(academicDepartment.id, departmentId));

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    //Check name uniqueness (if changed)
    if (name && name !== department.name) {
      const [nameExists] = await db
        .select()
        .from(academicDepartment)
        .where(
          and(
            eq(academicDepartment.name, name),
            ne(academicDepartment.id, departmentId),
          ),
        );

      if (nameExists) {
        return res.status(400).json({
          message: "Department name already exists",
        });
      }
    }

    //  Update department fields
    const [updatedDepartment] = await db
      .update(academicDepartment)
      .set({
        ...(name && { name }),
        ...(location && { location }),
      })
      .where(eq(academicDepartment.id, departmentId))
      .returning();

    let assignedManagerEmail = null;
    let infoMessage = "Department updated successfully";

    //  Handle manager assignment
    const existingManagers = await db
      .select()
      .from(user)
      .where(eq(user.departmentId, departmentId));

    if (managerEmail === null) {
      if (existingManagers.length > 0) {
        await db.delete(user).where(eq(user.departmentId, departmentId));
      }
      assignedManagerEmail = null;
    }

    // If managerEmail is provided → assign / create manager
    else if (managerEmail) {
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, managerEmail));

      if (existingUser) {
        if (
          existingUser.departmentId &&
          existingUser.departmentId !== departmentId
        ) {
          infoMessage = `Manager is already assigned to another department`;
        }
        // } else {
        //   // Remove old manager first
        //   await db.delete(user).where(eq(user.departmentId, departmentId));

        //   // await db
        //   //   .update(user)
        //   //   .set({ departmentId })
        //   //   .where(eq(user.id, existingUser.id));

        //   assignedManagerEmail = managerEmail;
        // }
      } else {
        // Remove old manager first
        await db.delete(user).where(eq(user.departmentId, departmentId));
        const hashedPassword = await bcrypt.hash("1234", 10);
        await db.insert(user).values({
          email: managerEmail,
          password: hashedPassword,
          departmentId,
        });
        assignedManagerEmail = managerEmail;
      }
    }

    // Final response
    return res.status(200).json({
      ...updatedDepartment,
      managerEmail: assignedManagerEmail,
      message: infoMessage,
    });
  } catch (err) {
    console.error("updateDepartmentError:", err);
    return res.status(500).json({
      message: "Error updating department",
      error: err.message,
    });
  }
};
//Subject Areas
export const getAllSubjectAreas = async (req, res) => {
  try {
    const result = await db.select().from(subjectArea);

    const names = result.map((row) => row.name);

    return res.status(200).json(names);
  } catch (err) {
    console.error("getAllSubjectAreas error:", err);
    return res.status(500).json({
      message: "Failed to fetch subject areas",
    });
  }
};

export const addSubjectArea = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Subject area name is required",
      });
    }

    const trimmedName = name.trim();

    //  Check if already exists
    const [existing] = await db
      .select()
      .from(subjectArea)
      .where(eq(subjectArea.name, trimmedName));

    if (existing) {
      return res.status(400).json({
        message: "Subject area already exists",
      });
    }

    await db.insert(subjectArea).values({ name: trimmedName });

    return res.status(201).json({ name: trimmedName });
  } catch (err) {
    console.error("addSubjectArea error:", err);
    return res.status(500).json({
      message: "Failed to add subject area",
    });
  }
};

export const updateSubjectArea = async (req, res) => {
  try {
    const { oldName } = req.params;
    const { name: newName } = req.body;

    if (!newName || !newName.trim()) {
      return res.status(400).json({
        message: "New subject area name is required",
      });
    }

    const trimmedName = newName.trim();

    // Check old name exists
    const [oldExists] = await db
      .select()
      .from(subjectArea)
      .where(eq(subjectArea.name, oldName));

    if (!oldExists) {
      return res.status(404).json({
        message: "Subject area not found",
      });
    }

    //  Check new name already exists
    const [newExists] = await db
      .select()
      .from(subjectArea)
      .where(eq(subjectArea.name, trimmedName));

    if (newExists) {
      return res.status(400).json({
        message: "Subject area name already exists",
      });
    }

    await db
      .update(subjectArea)
      .set({ name: trimmedName })
      .where(eq(subjectArea.name, oldName));

    return res.status(200).json({ name: trimmedName });
  } catch (err) {
    console.error("updateSubjectArea error:", err);
    return res.status(500).json({
      message: "Failed to update subject area",
    });
  }
};
