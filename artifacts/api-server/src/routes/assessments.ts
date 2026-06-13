import { Router, type Request, type Response } from "express";
import { db, assessmentsTable, assessmentResultsTable, subjectsTable, studentsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function calculateGrade(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 75) return "B+";
  if (pct >= 70) return "B";
  if (pct >= 65) return "C+";
  if (pct >= 60) return "C";
  if (pct >= 55) return "D+";
  if (pct >= 50) return "D";
  return "F";
}

router.get("/classes/:classId/assessments", async (req: Request, res: Response) => {
  try {
    const { subjectId, type } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(assessmentsTable.classId, req.params.classId)];
    if (subjectId) conditions.push(eq(assessmentsTable.subjectId, subjectId));
    if (type) conditions.push(eq(assessmentsTable.type, type));

    const assessments = await db.select().from(assessmentsTable).where(and(...conditions));

    const enriched = await Promise.all(assessments.map(async a => {
      const [subject] = await db.select({ name: subjectsTable.name }).from(subjectsTable).where(eq(subjectsTable.id, a.subjectId));
      return { ...a, subjectName: subject?.name || null };
    }));

    res.json({ assessments: enriched, total: enriched.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/classes/:classId/assessments", async (req: Request, res: Response) => {
  try {
    const { subjectId, title, type, maxScore, weight, date, academicYear, academicTerm } = req.body;
    if (!subjectId || !title || !type || !maxScore || !academicYear) {
      res.status(400).json({ error: "subjectId, title, type, maxScore, and academicYear are required" });
      return;
    }

    const [assessment] = await db.insert(assessmentsTable).values({
      id: randomUUID(),
      classId: req.params.classId,
      subjectId,
      title,
      type,
      maxScore,
      weight: weight || null,
      date: date || null,
      academicYear,
      academicTerm: academicTerm || null,
    }).returning();

    const [subject] = await db.select({ name: subjectsTable.name }).from(subjectsTable).where(eq(subjectsTable.id, subjectId));
    res.status(201).json({ ...assessment, subjectName: subject?.name || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/assessments/:assessmentId", async (req: Request, res: Response) => {
  try {
    const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, req.params.assessmentId));
    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }
    const [subject] = await db.select({ name: subjectsTable.name }).from(subjectsTable).where(eq(subjectsTable.id, assessment.subjectId));
    res.json({ ...assessment, subjectName: subject?.name || null });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/assessments/:assessmentId/results", async (req: Request, res: Response) => {
  try {
    const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, req.params.assessmentId));
    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    const results = await db.select().from(assessmentResultsTable).where(eq(assessmentResultsTable.assessmentId, req.params.assessmentId));

    const enriched = await Promise.all(results.map(async r => {
      const [student] = await db
        .select({ firstName: studentsTable.firstName, lastName: studentsTable.lastName })
        .from(studentsTable)
        .where(eq(studentsTable.id, r.studentId));
      return {
        ...r,
        studentName: student ? `${student.firstName} ${student.lastName}` : null,
      };
    }));

    const totalScore = enriched.reduce((s, r) => s + r.score, 0);
    const avgScore = enriched.length > 0 ? parseFloat((totalScore / enriched.length).toFixed(2)) : null;
    const passCount = enriched.filter(r => r.score >= assessment.maxScore * 0.5).length;
    const passRate = enriched.length > 0 ? parseFloat(((passCount / enriched.length) * 100).toFixed(1)) : null;

    res.json({ assessmentId: req.params.assessmentId, results: enriched, averageScore: avgScore, passRate });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/assessments/:assessmentId/results", async (req: Request, res: Response) => {
  try {
    const { results } = req.body;
    if (!Array.isArray(results) || results.length === 0) {
      res.status(400).json({ error: "results array is required" });
      return;
    }

    const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, req.params.assessmentId));
    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    const recordedBy = (req as any).user?.id || null;

    const saved = await Promise.all(
      results.map(async (entry: { studentId: string; score: number; grade?: string; remarks?: string }) => {
        const grade = entry.grade || calculateGrade(entry.score, assessment.maxScore);

        const existing = await db
          .select()
          .from(assessmentResultsTable)
          .where(and(
            eq(assessmentResultsTable.assessmentId, req.params.assessmentId),
            eq(assessmentResultsTable.studentId, entry.studentId),
          ));

        if (existing.length > 0) {
          const [updated] = await db
            .update(assessmentResultsTable)
            .set({ score: entry.score, grade, remarks: entry.remarks || null, updatedAt: new Date() })
            .where(eq(assessmentResultsTable.id, existing[0].id))
            .returning();
          return updated;
        }

        const [result] = await db.insert(assessmentResultsTable).values({
          id: randomUUID(),
          assessmentId: req.params.assessmentId,
          studentId: entry.studentId,
          score: entry.score,
          grade,
          remarks: entry.remarks || null,
          recordedBy,
        }).returning();
        return result;
      })
    );

    const totalScore = saved.reduce((s, r) => s + r.score, 0);
    const avgScore = saved.length > 0 ? parseFloat((totalScore / saved.length).toFixed(2)) : null;
    const passCount = saved.filter(r => r.score >= assessment.maxScore * 0.5).length;
    const passRate = saved.length > 0 ? parseFloat(((passCount / saved.length) * 100).toFixed(1)) : null;

    res.status(201).json({ assessmentId: req.params.assessmentId, results: saved, averageScore: avgScore, passRate });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId/results", async (req: Request, res: Response) => {
  try {
    const { classId, subjectId } = req.query as Record<string, string>;

    const results = await db.select().from(assessmentResultsTable).where(eq(assessmentResultsTable.studentId, req.params.studentId));

    const enriched = await Promise.all(results.map(async r => {
      const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, r.assessmentId));
      if (classId && assessment?.classId !== classId) return null;
      if (subjectId && assessment?.subjectId !== subjectId) return null;
      return { ...r, assessmentTitle: assessment?.title, assessmentType: assessment?.type };
    }));

    const filtered = enriched.filter(Boolean);
    const totalScore = filtered.reduce((s, r) => s + (r?.score || 0), 0);
    const totalMax = await Promise.all(filtered.map(async r => {
      const [a] = await db.select({ maxScore: assessmentsTable.maxScore }).from(assessmentsTable).where(eq(assessmentsTable.id, r!.assessmentId));
      return a?.maxScore || 0;
    })).then(arr => arr.reduce((s, v) => s + v, 0));

    const gpa = totalMax > 0 ? parseFloat(((totalScore / totalMax) * 4).toFixed(2)) : null;

    res.json({ studentId: req.params.studentId, results: filtered, gpa });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
