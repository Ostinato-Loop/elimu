import { Router, type Request, type Response } from "express";
import { db, timetableEntriesTable, subjectsTable, staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/classes/:classId/timetable", async (req: Request, res: Response) => {
  try {
    const entries = await db
      .select()
      .from(timetableEntriesTable)
      .where(eq(timetableEntriesTable.classId, (req.params.classId as string)));

    const enriched = await Promise.all(entries.map(async entry => {
      const [subject] = await db.select({ name: subjectsTable.name }).from(subjectsTable).where(eq(subjectsTable.id, entry.subjectId));
      let teacherName: string | null = null;
      if (entry.teacherId) {
        const [teacher] = await db
          .select({ firstName: staffTable.firstName, lastName: staffTable.lastName })
          .from(staffTable)
          .where(eq(staffTable.id, entry.teacherId));
        if (teacher) teacherName = `${teacher.firstName} ${teacher.lastName}`;
      }
      return {
        ...entry,
        subjectName: subject?.name || null,
        teacherName,
      };
    }));

    res.json({ classId: (req.params.classId as string), entries: enriched });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/classes/:classId/timetable", async (req: Request, res: Response) => {
  try {
    const { subjectId, teacherId, dayOfWeek, startTime, endTime, room } = req.body;
    if (!subjectId || !dayOfWeek || !startTime || !endTime) {
      res.status(400).json({ error: "subjectId, dayOfWeek, startTime, and endTime are required" });
      return;
    }

    const [entry] = await db.insert(timetableEntriesTable).values({
      id: randomUUID(),
      classId: (req.params.classId as string),
      subjectId,
      teacherId: teacherId || null,
      dayOfWeek,
      startTime,
      endTime,
      room: room || null,
    }).returning();

    res.status(201).json(entry);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.delete("/timetable/:entryId", async (req: Request, res: Response) => {
  try {
    await db.delete(timetableEntriesTable).where(eq(timetableEntriesTable.id, (req.params.entryId as string)));
    res.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
