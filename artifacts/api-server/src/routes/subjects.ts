import { Router, type Request, type Response } from "express";
import { db, subjectsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools/:schoolId/subjects", async (req: Request, res: Response) => {
  try {
    const { academicLevel } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(subjectsTable.schoolId, req.params.schoolId)];
    if (academicLevel) conditions.push(eq(subjectsTable.academicLevel, academicLevel));

    const subjects = await db.select().from(subjectsTable).where(and(...conditions));
    res.json({ subjects, total: subjects.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/subjects", async (req: Request, res: Response) => {
  try {
    const { name, code, academicLevel, description, creditUnits } = req.body;
    if (!name || !code || !academicLevel) {
      res.status(400).json({ error: "name, code, and academicLevel are required" });
      return;
    }

    const [subject] = await db.insert(subjectsTable).values({
      id: randomUUID(),
      name,
      code,
      schoolId: req.params.schoolId,
      academicLevel,
      description: description || null,
      creditUnits: creditUnits || null,
    }).returning();

    res.status(201).json(subject);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/subjects/:subjectId", async (req: Request, res: Response) => {
  try {
    const [subject] = await db.select().from(subjectsTable).where(eq(subjectsTable.id, req.params.subjectId));
    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    res.json(subject);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.put("/subjects/:subjectId", async (req: Request, res: Response) => {
  try {
    const { name, code, description, creditUnits } = req.body;

    const [subject] = await db
      .update(subjectsTable)
      .set({
        ...(name && { name }),
        ...(code && { code }),
        ...(description !== undefined && { description }),
        ...(creditUnits !== undefined && { creditUnits }),
        updatedAt: new Date(),
      })
      .where(eq(subjectsTable.id, req.params.subjectId))
      .returning();

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    res.json(subject);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
