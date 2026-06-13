import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import schoolsRouter from "./schools";
import studentsRouter from "./students";
import staffRouter from "./staff";
import parentsRouter from "./parents";
import classesRouter from "./classes";
import subjectsRouter from "./subjects";
import timetablesRouter from "./timetables";
import attendanceRouter from "./attendance";
import assessmentsRouter from "./assessments";
import feesRouter from "./fees";
import paymentsRouter from "./payments";
import announcementsRouter from "./announcements";
import verificationRouter from "./verification";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(schoolsRouter);
router.use(studentsRouter);
router.use(staffRouter);
router.use(parentsRouter);
router.use(classesRouter);
router.use(subjectsRouter);
router.use(timetablesRouter);
router.use(attendanceRouter);
router.use(assessmentsRouter);
router.use(feesRouter);
router.use(paymentsRouter);
router.use(announcementsRouter);
router.use(verificationRouter);
router.use(dashboardRouter);

export default router;
