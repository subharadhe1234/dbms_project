import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

if (!process.env.DATABASE_URL) {
  console.error(" DATABASE_URL not loaded");
  process.exit(1);
}

import express from "express";
import cors from "cors";
import session from "express-session";
import authRouter from "./routes/authRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import departmentRouter from "./routes/departmentRoutes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    name: "session-id",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/report", reportRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Tathyakosh backend is running.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
