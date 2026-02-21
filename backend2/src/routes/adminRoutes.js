import { Router } from "express";
import {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  getAllSubjectAreas,
  addSubjectArea,
  updateSubjectArea,
} from "../controller/adminController.js";

const adminRouter = Router();

adminRouter.get("/", getAllDepartments);
adminRouter.post("/", addDepartment);
adminRouter.put("/:departmentId", updateDepartment);
adminRouter.get("/subject-areas", getAllSubjectAreas);
adminRouter.post("/subject-areas", addSubjectArea);
adminRouter.put("/subject-areas/:oldName", updateSubjectArea);

export default adminRouter;
