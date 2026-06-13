import { Router, type Request, type Response } from "express";
import { db, attendanceRecordsTable, studentsTable } from "@workspace/db";
import { eq, and, gte, lte, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/classes/:classId/attendance", async (req: Request, res: Response) => {
  try {
    const { date, from, to } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(attendanceRecordsTable.classId, req.params.classId)];
    if (date) conditions.push(eq(attendanceRecordsTable.date, date));
    if (from) conditions.push(gte(attendanceRecordsTable.date, from));
    if (to) conditions.push(lte(attendanceRecordsTable.date, to));

    const records = await db.select().from(attendanceRecordsTable).where(and(...conditions));
    res.json({ records, total: records.length, date: date || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/classes/:classId/attendance", async (req: Request, res: Response) => {
  try {
    const { date, entries } = req.body;
    if (!date || !Array.isArray(entries) || entries.length === 0) {
      res.status(400).json({ error: "date and entries array are required" });
      return;
    }

    const recordedBy = (req as any).user?.id || null;

    const records = await Promise.all(
      entries.map(async (entry: { studentId: string; status: string; remarks?: string }) => {
        const existing = await db
          .select()
          .from(attendanceRecordsTable)
          .where(and(
            eq(attendanceRecordsTable.classId, req.params.classId),
            eq(attendanceRecordsTable.studentId, entry.studentId),
            eq(attendanceRecordsTable.date, date),
          ));

        if (existing.length > 0) {
          const [updated] = await db
            .update(attendanceRecordsTable)
            .set({ status: entry.status, remarks: entry.remarks || null })
            .where(eq(attendanceRecordsTable.id, existing[0].id))
            .returning();
          return updated;
        }

        const [record] = await db.insert(attendanceRecordsTable).values({
          id: randomUUID(),
          classId: req.params.classId,
          studentId: entry.studentId,
          date,
          status: entry.status,
          remarks: entry.remarks || null,
          recordedBy,
        }).returning();
        return record;
      })
    );

    const present = records.filter(r => r.status === "present").length;
    const absent = records.filter(r => r.status === "absent").length;
    const late = records.filter(r => r.status === "late").length;
    const excused = records.filter(r => r.status === "excused").length;
    const total = records.length;

    res.status(201).json({
      classId: req.params.classId,
      date,
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      lateCount: late,
      excusedCount: excused,
      attendanceRate: total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId/attendance", async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(attendanceRecordsTable.studentId, req.params.studentId)];
    if (from) conditions.push(gte(attendanceRecordsTable.date, from));
    if (to) conditions.push(lte(attendanceRecordsTable.date, to));

    const records = await db.select().from(attendanceRecordsTable).where(and(...conditions));

    const present = records.filter(r => r.status === "present").length;
    const absent = records.filter(r => r.status === "absent").length;
    const late = records.filter(r => r.status === "late").length;
    const excused = records.filter(r => r.status === "excused").length;
    const total = records.length;

    res.json({
      studentId: req.params.studentId,
      records,
      summary: {
        classId: records[0]?.classId || "",
        date: new Date().toISOString().split("T")[0],
        totalStudents: total,
        presentCount: present,
        absentCount: absent,
        lateCount: late,
        excusedCount: excused,
        attendanceRate: total > 0 ? parseFloat(((present / total) * 100).toFixed(1)) : 0,
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
