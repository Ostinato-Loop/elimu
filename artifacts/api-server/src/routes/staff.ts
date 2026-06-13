import { Router, type Request, type Response } from "express";
import { db, staffTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function generateStaffNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `STF-${year}-${rand}`;
}

router.get("/schools/:schoolId/staff", async (req: Request, res: Response) => {
  try {
    const { role, search, page = "1", limit = "50" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [eq(staffTable.schoolId, req.params.schoolId)];
    if (role) conditions.push(eq(staffTable.role, role));

    let all = await db.select().from(staffTable).where(and(...conditions));

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(st =>
        st.firstName.toLowerCase().includes(s) ||
        st.lastName.toLowerCase().includes(s) ||
        (st.email && st.email.toLowerCase().includes(s))
      );
    }

    const staff = all.slice(offset, offset + limitNum).map(s => ({
      ...s,
      subjectIds: JSON.parse(s.subjectIds || "[]"),
      certifications: JSON.parse(s.certifications || "[]"),
    }));

    res.json({ staff, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/staff", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, subjectIds = [], certifications = [], joinedDate, profileImageUrl } = req.body;
    if (!firstName || !lastName || !role) {
      res.status(400).json({ error: "firstName, lastName, and role are required" });
      return;
    }

    const [member] = await db.insert(staffTable).values({
      id: randomUUID(),
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      staffNumber: generateStaffNumber(),
      schoolId: req.params.schoolId,
      role,
      subjectIds: JSON.stringify(subjectIds),
      certifications: JSON.stringify(certifications),
      joinedDate: joinedDate || new Date().toISOString().split("T")[0],
      status: "active",
      profileImageUrl: profileImageUrl || null,
    }).returning();

    res.status(201).json({
      ...member,
      subjectIds: JSON.parse(member.subjectIds || "[]"),
      certifications: JSON.parse(member.certifications || "[]"),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/staff/:staffId", async (req: Request, res: Response) => {
  try {
    const [member] = await db
      .select()
      .from(staffTable)
      .where(eq(staffTable.id, req.params.staffId));

    if (!member) {
      res.status(404).json({ error: "Staff member not found" });
      return;
    }
    res.json({
      ...member,
      subjectIds: JSON.parse(member.subjectIds || "[]"),
      certifications: JSON.parse(member.certifications || "[]"),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.put("/staff/:staffId", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, role, subjectIds, certifications, status, profileImageUrl } = req.body;

    const [member] = await db
      .update(staffTable)
      .set({
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(role && { role }),
        ...(subjectIds !== undefined && { subjectIds: JSON.stringify(subjectIds) }),
        ...(certifications !== undefined && { certifications: JSON.stringify(certifications) }),
        ...(status && { status }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        updatedAt: new Date(),
      })
      .where(eq(staffTable.id, req.params.staffId))
      .returning();

    if (!member) {
      res.status(404).json({ error: "Staff member not found" });
      return;
    }
    res.json({
      ...member,
      subjectIds: JSON.parse(member.subjectIds || "[]"),
      certifications: JSON.parse(member.certifications || "[]"),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
