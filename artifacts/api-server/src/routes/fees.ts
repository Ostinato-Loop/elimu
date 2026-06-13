import { Router, type Request, type Response } from "express";
import { db, feeStructuresTable, feePaymentsTable, studentsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools/:schoolId/fees", async (req: Request, res: Response) => {
  try {
    const { academicYear, academicTerm } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(feeStructuresTable.schoolId, req.params.schoolId)];
    if (academicYear) conditions.push(eq(feeStructuresTable.academicYear, academicYear));
    if (academicTerm) conditions.push(eq(feeStructuresTable.academicTerm, academicTerm));

    const fees = await db.select().from(feeStructuresTable).where(and(...conditions));
    res.json({ fees, total: fees.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/fees", async (req: Request, res: Response) => {
  try {
    const { name, amount, currency = "NGN", academicYear, academicTerm, academicLevel, dueDate, description } = req.body;
    if (!name || !amount || !academicYear || !academicLevel) {
      res.status(400).json({ error: "name, amount, academicYear, and academicLevel are required" });
      return;
    }

    const [fee] = await db.insert(feeStructuresTable).values({
      id: randomUUID(),
      schoolId: req.params.schoolId,
      name,
      amount,
      currency,
      academicYear,
      academicTerm: academicTerm || null,
      academicLevel,
      dueDate: dueDate || null,
      description: description || null,
    }).returning();

    res.status(201).json(fee);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/fees/:feeId", async (req: Request, res: Response) => {
  try {
    const [fee] = await db.select().from(feeStructuresTable).where(eq(feeStructuresTable.id, req.params.feeId));
    if (!fee) {
      res.status(404).json({ error: "Fee structure not found" });
      return;
    }
    res.json(fee);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/fees/:feeId/payments", async (req: Request, res: Response) => {
  try {
    const { status } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(feePaymentsTable.feeStructureId, req.params.feeId)];
    if (status) conditions.push(eq(feePaymentsTable.status, status));

    const payments = await db.select().from(feePaymentsTable).where(and(...conditions));
    const enriched = await Promise.all(payments.map(async p => {
      const [student] = await db
        .select({ firstName: studentsTable.firstName, lastName: studentsTable.lastName })
        .from(studentsTable)
        .where(eq(studentsTable.id, p.studentId));
      return {
        ...p,
        studentName: student ? `${student.firstName} ${student.lastName}` : null,
      };
    }));

    const totalAmount = enriched.reduce((s, p) => s + p.amountPaid, 0);
    res.json({ payments: enriched, total: enriched.length, totalAmount });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
