import { Router, type Request, type Response } from "express";
import { db, classesTable, studentsTable, classEnrollmentsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools/:schoolId/classes", async (req: Request, res: Response) => {
  try {
    const { academicYear, academicTerm, page = "1", limit = "50" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [eq(classesTable.schoolId, req.params.schoolId)];
    if (academicYear) conditions.push(eq(classesTable.academicYear, academicYear));
    if (academicTerm) conditions.push(eq(classesTable.academicTerm, academicTerm));

    const all = await db.select().from(classesTable).where(and(...conditions));
    const classes = all.slice(offset, offset + limitNum);
    res.json({ classes, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/classes", async (req: Request, res: Response) => {
  try {
    const { name, teacherId, academicYear, academicTerm, academicLevel, roomNumber } = req.body;
    if (!name || !academicYear || !academicLevel) {
      res.status(400).json({ error: "name, academicYear, and academicLevel are required" });
      return;
    }

    const [cls] = await db.insert(classesTable).values({
      id: randomUUID(),
      name,
      schoolId: req.params.schoolId,
      teacherId: teacherId || null,
      academicYear,
      academicTerm: academicTerm || null,
      academicLevel,
      studentCount: 0,
      roomNumber: roomNumber || null,
    }).returning();

    res.status(201).json(cls);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/classes/:classId", async (req: Request, res: Response) => {
  try {
    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, req.params.classId));
    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json(cls);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.put("/classes/:classId", async (req: Request, res: Response) => {
  try {
    const { name, teacherId, academicTerm, roomNumber } = req.body;

    const [cls] = await db
      .update(classesTable)
      .set({
        ...(name && { name }),
        ...(teacherId !== undefined && { teacherId }),
        ...(academicTerm !== undefined && { academicTerm }),
        ...(roomNumber !== undefined && { roomNumber }),
        updatedAt: new Date(),
      })
      .where(eq(classesTable.id, req.params.classId))
      .returning();

    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }
    res.json(cls);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/classes/:classId/students", async (req: Request, res: Response) => {
  try {
    const enrollments = await db
      .select({ studentId: classEnrollmentsTable.studentId })
      .from(classEnrollmentsTable)
      .where(and(
        eq(classEnrollmentsTable.classId, req.params.classId),
        eq(classEnrollmentsTable.status, "active")
      ));

    const studentIds = enrollments.map(e => e.studentId);
    const students = studentIds.length > 0
      ? await Promise.all(studentIds.map(id =>
          db.select().from(studentsTable).where(eq(studentsTable.id, id)).then(r => r[0])
        )).then(r => r.filter(Boolean))
      : [];

    res.json({ students, total: students.length, page: 1, limit: students.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/classes/:classId/students", async (req: Request, res: Response) => {
  try {
    const { studentId, academicYear } = req.body;
    if (!studentId) {
      res.status(400).json({ error: "studentId is required" });
      return;
    }

    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, req.params.classId));
    if (!cls) {
      res.status(404).json({ error: "Class not found" });
      return;
    }

    const [enrollment] = await db.insert(classEnrollmentsTable).values({
      id: randomUUID(),
      classId: req.params.classId,
      studentId,
      academicYear: academicYear || cls.academicYear,
      status: "active",
    }).returning();

    await db.update(studentsTable).set({ classId: req.params.classId }).where(eq(studentsTable.id, studentId));

    const count = await db
      .select({ studentId: classEnrollmentsTable.studentId })
      .from(classEnrollmentsTable)
      .where(and(eq(classEnrollmentsTable.classId, req.params.classId), eq(classEnrollmentsTable.status, "active")));

    await db.update(classesTable).set({ studentCount: count.length }).where(eq(classesTable.id, req.params.classId));

    res.status(201).json(enrollment);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
