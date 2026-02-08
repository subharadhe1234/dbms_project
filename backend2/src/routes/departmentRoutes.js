import { Router } from "express";
import {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  getAllSubjectAreas,
  addSubjectArea,
  updateSubjectArea,
} from "../controller/departmentController.js";

const departmentRouter = Router();

departmentRouter.get("/", getAllDepartments);
departmentRouter.post("/", addDepartment);
departmentRouter.put("/:departmentId", updateDepartment);
departmentRouter.get("/subject-areas", getAllSubjectAreas);
departmentRouter.post("/subject-areas", addSubjectArea);
departmentRouter.put("/subject-areas/:oldName", updateSubjectArea);

export default departmentRouter;
