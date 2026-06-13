import { Router, type Request, type Response } from "express";
import { db, parentsTable, studentsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools/:schoolId/parents", async (req: Request, res: Response) => {
  try {
    const { search, page = "1", limit = "50" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    let all = await db.select().from(parentsTable).where(eq(parentsTable.schoolId, (req.params.schoolId as string)));

    if (search) {
      const s = search.toLowerCase();
      all = all.filter(p =>
        p.firstName.toLowerCase().includes(s) ||
        p.lastName.toLowerCase().includes(s) ||
        (p.email && p.email.toLowerCase().includes(s)) ||
        (p.phone && p.phone.includes(s))
      );
    }

    const parents = all.slice(offset, offset + limitNum).map(p => ({
      ...p,
      childrenIds: JSON.parse(p.childrenIds || "[]"),
    }));

    res.json({ parents, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/parents", async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, occupation, address, studentIds = [] } = req.body;
    if (!firstName || !lastName) {
      res.status(400).json({ error: "firstName and lastName are required" });
      return;
    }

    const [parent] = await db.insert(parentsTable).values({
      id: randomUUID(),
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      schoolId: (req.params.schoolId as string),
      occupation: occupation || null,
      address: address || null,
      childrenIds: JSON.stringify(studentIds),
    }).returning();

    res.status(201).json({
      ...parent,
      childrenIds: JSON.parse(parent.childrenIds || "[]"),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/parents/:parentId", async (req: Request, res: Response) => {
  try {
    const [parent] = await db.select().from(parentsTable).where(eq(parentsTable.id, (req.params.parentId as string)));
    if (!parent) {
      res.status(404).json({ error: "Parent not found" });
      return;
    }
    res.json({ ...parent, childrenIds: JSON.parse(parent.childrenIds || "[]") });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/parents/:parentId/children", async (req: Request, res: Response) => {
  try {
    const [parent] = await db.select().from(parentsTable).where(eq(parentsTable.id, (req.params.parentId as string)));
    if (!parent) {
      res.status(404).json({ error: "Parent not found" });
      return;
    }

    const childIds: string[] = JSON.parse(parent.childrenIds || "[]");
    const children = childIds.length > 0
      ? await Promise.all(childIds.map(id =>
          db.select().from(studentsTable).where(eq(studentsTable.id, id)).then(r => r[0]).catch(() => null)
        )).then(r => r.filter(Boolean))
      : [];

    res.json({ children });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
