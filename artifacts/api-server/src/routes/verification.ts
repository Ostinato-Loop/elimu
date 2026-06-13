import { Router, type Request, type Response } from "express";
import { db, credentialsTable, studentsTable, schoolsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID, createHash } from "crypto";

const router = Router();

function generateVerificationHash(studentId: string, type: string, title: string, issuedAt: Date): string {
  return createHash("sha256")
    .update(`${studentId}:${type}:${title}:${issuedAt.toISOString()}:${randomUUID()}`)
    .digest("hex");
}

router.get("/verify/:hash", async (req: Request, res: Response) => {
  try {
    const [credential] = await db
      .select()
      .from(credentialsTable)
      .where(eq(credentialsTable.verificationHash, req.params.hash));

    if (!credential) {
      res.status(404).json({
        verified: false,
        credential: null,
        message: "No credential found with this verification code.",
      });
      return;
    }

    res.json({
      verified: credential.verified,
      credential,
      message: credential.verified
        ? "This credential is authentic and has been verified."
        : "This credential could not be verified.",
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/credentials", async (req: Request, res: Response) => {
  try {
    const { studentId, type, title, metadata } = req.body;
    if (!studentId || !type || !title) {
      res.status(400).json({ error: "studentId, type, and title are required" });
      return;
    }

    const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    const [school] = await db.select({ name: schoolsTable.name }).from(schoolsTable).where(eq(schoolsTable.id, student.schoolId));

    const issuedAt = new Date();
    const verificationHash = generateVerificationHash(studentId, type, title, issuedAt);

    const [credential] = await db.insert(credentialsTable).values({
      id: randomUUID(),
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      schoolId: student.schoolId,
      schoolName: school?.name || null,
      type,
      title,
      issuedAt,
      verificationHash,
      verified: true,
      metadata: metadata || null,
    }).returning();

    res.status(201).json(credential);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId/credentials", async (req: Request, res: Response) => {
  try {
    const credentials = await db
      .select()
      .from(credentialsTable)
      .where(eq(credentialsTable.studentId, req.params.studentId));

    res.json({ credentials, total: credentials.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
