import { Router, type Request, type Response } from "express";
import {
  db,
  schoolsTable,
  studentsTable,
  staffTable,
  classesTable,
  parentsTable,
  attendanceRecordsTable,
  feeStructuresTable,
  feePaymentsTable,
  announcementsTable,
} from "@workspace/db";
import { eq, and, desc, gte } from "drizzle-orm";

const router = Router();

router.get("/schools/:schoolId/dashboard", async (req: Request, res: Response) => {
  try {
    const schoolId = (req.params.schoolId as string);

    const [school] = await db.select().from(schoolsTable).where(eq(schoolsTable.id, schoolId));
    if (!school) {
      res.status(404).json({ error: "School not found" });
      return;
    }

    const [
      students,
      staffMembers,
      classes,
      parents,
    ] = await Promise.all([
      db.select().from(studentsTable).where(and(eq(studentsTable.schoolId, schoolId), eq(studentsTable.status, "active"))),
      db.select().from(staffTable).where(and(eq(staffTable.schoolId, schoolId), eq(staffTable.status, "active"))),
      db.select().from(classesTable).where(eq(classesTable.schoolId, schoolId)),
      db.select().from(parentsTable).where(eq(parentsTable.schoolId, schoolId)),
    ]);

    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = await db
      .select()
      .from(attendanceRecordsTable)
      .where(eq(attendanceRecordsTable.date, today));

    const presentToday = todayAttendance.filter(r => r.status === "present").length;
    const attendanceRateToday = todayAttendance.length > 0
      ? parseFloat(((presentToday / todayAttendance.length) * 100).toFixed(1))
      : null;

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const recentPaymentsAll = await db
      .select()
      .from(feePaymentsTable)
      .where(eq(feePaymentsTable.status, "completed"))
      .orderBy(desc(feePaymentsTable.createdAt));

    const recentPaymentsList = recentPaymentsAll.slice(0, 5);

    const allFees = await db.select().from(feeStructuresTable).where(eq(feeStructuresTable.schoolId, schoolId));
    const totalFeeAmount = allFees.reduce((s, f) => s + f.amount * students.length, 0);
    const totalPaid = recentPaymentsAll.reduce((s, p) => s + p.amountPaid, 0);
    const outstandingFees = Math.max(0, totalFeeAmount - totalPaid);

    const recentAnnouncements = await db
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.schoolId, schoolId))
      .orderBy(desc(announcementsTable.publishedAt))
      .limit(5)
      .then(rows => rows);

    const attendanceByClass = await Promise.all(
      classes.map(async cls => {
        const classAttendance = todayAttendance.filter(r => r.classId === cls.id);
        const presentInClass = classAttendance.filter(r => r.status === "present").length;
        const rate = classAttendance.length > 0
          ? parseFloat(((presentInClass / classAttendance.length) * 100).toFixed(1))
          : 0;
        return {
          classId: cls.id,
          className: cls.name,
          attendanceRate: rate,
          date: today,
        };
      })
    );

    res.json({
      schoolId,
      school,
      stats: {
        totalStudents: students.length,
        totalStaff: staffMembers.length,
        totalClasses: classes.length,
        totalParents: parents.length,
        attendanceRateToday,
        outstandingFees,
        recentPayments: recentPaymentsAll.length,
      },
      recentAnnouncements,
      attendanceByClass,
      recentPaymentsList,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
