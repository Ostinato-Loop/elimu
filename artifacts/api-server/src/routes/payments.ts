import { Router, type Request, type Response } from "express";
import { db, feePaymentsTable, studentsTable, feeStructuresTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.post("/payments", async (req: Request, res: Response) => {
  try {
    const { feeStructureId, studentId, amountPaid, currency = "NGN", paymentMethod, reference, status = "completed", paidAt } = req.body;
    if (!feeStructureId || !studentId || !amountPaid || !paymentMethod) {
      res.status(400).json({ error: "feeStructureId, studentId, amountPaid, and paymentMethod are required" });
      return;
    }

    const ref = reference || `ELIMU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const [payment] = await db.insert(feePaymentsTable).values({
      id: randomUUID(),
      feeStructureId,
      studentId,
      amountPaid,
      currency,
      paymentMethod,
      reference: ref,
      status,
      paidAt: paidAt ? new Date(paidAt) : (status === "completed" ? new Date() : null),
    }).returning();

    const [student] = await db
      .select({ firstName: studentsTable.firstName, lastName: studentsTable.lastName })
      .from(studentsTable)
      .where(eq(studentsTable.id, studentId));

    res.status(201).json({
      ...payment,
      studentName: student ? `${student.firstName} ${student.lastName}` : null,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId/payments", async (req: Request, res: Response) => {
  try {
    const { status, academicYear } = req.query as Record<string, string>;

    const conditions: SQL[] = [eq(feePaymentsTable.studentId, req.params.studentId)];
    if (status) conditions.push(eq(feePaymentsTable.status, status));

    let payments = await db.select().from(feePaymentsTable).where(and(...conditions));

    if (academicYear) {
      const filtered = await Promise.all(payments.map(async p => {
        const [fee] = await db.select({ academicYear: feeStructuresTable.academicYear }).from(feeStructuresTable).where(eq(feeStructuresTable.id, p.feeStructureId));
        return fee?.academicYear === academicYear ? p : null;
      }));
      payments = filtered.filter(Boolean) as typeof payments;
    }

    const totalAmount = payments.reduce((s, p) => s + p.amountPaid, 0);
    res.json({ payments, total: payments.length, totalAmount });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/payments/:paymentId", async (req: Request, res: Response) => {
  try {
    const [payment] = await db.select().from(feePaymentsTable).where(eq(feePaymentsTable.id, req.params.paymentId));
    if (!payment) {
      res.status(404).json({ error: "Payment not found" });
      return;
    }
    const [student] = await db
      .select({ firstName: studentsTable.firstName, lastName: studentsTable.lastName })
      .from(studentsTable)
      .where(eq(studentsTable.id, payment.studentId));

    res.json({
      ...payment,
      studentName: student ? `${student.firstName} ${student.lastName}` : null,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
