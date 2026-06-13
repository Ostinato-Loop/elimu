import { Router, type Request, type Response } from "express";
import { db, studentsTable, assessmentResultsTable, assessmentsTable, subjectsTable, schoolsTable } from "@workspace/db";
import { eq, and, like, or, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function generateStudentNumber(schoolId: string): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `STU-${year}-${rand}`;
}

router.get("/schools/:schoolId/students", async (req: Request, res: Response) => {
  try {
    const { classId, status, search, page = "1", limit = "50" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [eq(studentsTable.schoolId, (req.params.schoolId as string))];
    if (classId) conditions.push(eq(studentsTable.classId, classId));
    if (status) conditions.push(eq(studentsTable.status, status));

    let all = await db.select().from(studentsTable).where(and(...conditions));

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(st =>
        st.firstName.toLowerCase().includes(s) ||
        st.lastName.toLowerCase().includes(s) ||
        st.studentNumber.toLowerCase().includes(s) ||
        (st.email && st.email.toLowerCase().includes(s))
      );
    }

    const students = all.slice(offset, offset + limitNum);
    res.json({ students, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/students", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, enrollmentDate, academicLevel, classId, profileImageUrl } = req.body;
    if (!firstName || !lastName || !academicLevel) {
      res.status(400).json({ error: "firstName, lastName, and academicLevel are required" });
      return;
    }

    const [student] = await db.insert(studentsTable).values({
      id: randomUUID(),
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      studentNumber: generateStudentNumber((req.params.schoolId as string)),
      schoolId: (req.params.schoolId as string),
      classId: classId || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      enrollmentDate: enrollmentDate || new Date().toISOString().split("T")[0],
      academicLevel,
      status: "active",
      profileImageUrl: profileImageUrl || null,
    }).returning();

    await db
      .update(schoolsTable)
      .set({ enrollmentCount: (await db.select().from(studentsTable).where(eq(studentsTable.schoolId, (req.params.schoolId as string)))).length })
      .where(eq(schoolsTable.id, (req.params.schoolId as string)));

    res.status(201).json(student);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId", async (req: Request, res: Response) => {
  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, (req.params.studentId as string)));

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json(student);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.put("/students/:studentId", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, classId, status, profileImageUrl } = req.body;

    const [student] = await db
      .update(studentsTable)
      .set({
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender }),
        ...(classId !== undefined && { classId }),
        ...(status && { status }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        updatedAt: new Date(),
      })
      .where(eq(studentsTable.id, (req.params.studentId as string)))
      .returning();

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    res.json(student);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/students/:studentId/transcript", async (req: Request, res: Response) => {
  try {
    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, (req.params.studentId as string)));

    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }

    const results = await db
      .select({
        score: assessmentResultsTable.score,
        grade: assessmentResultsTable.grade,
        remarks: assessmentResultsTable.remarks,
        assessmentTitle: assessmentsTable.title,
        assessmentType: assessmentsTable.type,
        maxScore: assessmentsTable.maxScore,
        assessmentDate: assessmentsTable.date,
        academicYear: assessmentsTable.academicYear,
        academicTerm: assessmentsTable.academicTerm,
        subjectName: subjectsTable.name,
        subjectCode: subjectsTable.code,
      })
      .from(assessmentResultsTable)
      .innerJoin(assessmentsTable, eq(assessmentResultsTable.assessmentId, assessmentsTable.id))
      .innerJoin(subjectsTable, eq(assessmentsTable.subjectId, subjectsTable.id))
      .where(eq(assessmentResultsTable.studentId, (req.params.studentId as string)));

    const entries = results.map(r => ({
      subjectName: r.subjectName,
      subjectCode: r.subjectCode,
      assessmentType: r.assessmentType,
      score: r.score,
      maxScore: r.maxScore,
      grade: r.grade,
      academicYear: r.academicYear,
      academicTerm: r.academicTerm,
      assessmentDate: r.assessmentDate,
    }));

    const totalScore = entries.reduce((s, e) => s + e.score, 0);
    const totalMax = entries.reduce((s, e) => s + e.maxScore, 0);
    const gpa = totalMax > 0 ? parseFloat(((totalScore / totalMax) * 4).toFixed(2)) : null;

    res.json({ student, entries, gpa, totalCredits: entries.length });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
