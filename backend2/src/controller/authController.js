import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { user } from "../db/schema/schema.js";

//LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (result.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const dbUser = result[0];

    const isValid = await bcrypt.compare(password, dbUser.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create session
    req.session.user = {
      id: dbUser.id,
      email: dbUser.email,
      departmentId: dbUser.departmentId ?? null,
    };

    return res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//LOGOUT

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    res.clearCookie("session-id");

    return res.status(200).json({
      message: "Logout successful",
    });
  });
};
