import { Router } from "express";
import {
  getFacultyContinuingEducation,
  getTeachingLoadReport,
  getHighAchieversReport,
} from "../controller/reportController.js";

const reportRouter = Router();

reportRouter.get(
  "/faculty-continuing-education",
  getFacultyContinuingEducation,
);

reportRouter.get("/teaching-load", getTeachingLoadReport);

reportRouter.get("/high-achievers", getHighAchieversReport);

export default reportRouter;
