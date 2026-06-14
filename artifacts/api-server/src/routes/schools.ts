import { Router, type Request, type Response } from "express";
import { db, schoolsTable } from "@workspace/db";
import { eq, and, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools", async (req: Request, res: Response) => {
  try {
    const { country, type, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [];
    if (country) conditions.push(eq(schoolsTable.country, country));
    if (type) conditions.push(eq(schoolsTable.type, type));

    const query = conditions.length > 0
      ? db.select().from(schoolsTable).where(and(...conditions))
      : db.select().from(schoolsTable);

    const all = await query;
    const schools = all.slice(offset, offset + limitNum);

    res.json({ schools, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/my/schools", async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const schools = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.createdById, req.user.id));

    res.json({ schools });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools", async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, type, country, state, city, address, phone, email, logoUrl } = req.body;
    if (!name || !type || !country) {
      res.status(400).json({ error: "name, type, and country are required" });
      return;
    }

    const [school] = await db.insert(schoolsTable).values({
      id: randomUUID(),
      name,
      type,
      country,
      state: state || null,
      city: city || null,
      address: address || null,
      phone: phone || null,
      email: email || null,
      logoUrl: logoUrl || null,
      verificationStatus: "unverified",
      enrollmentCount: 0,
      createdById: req.user.id,
    }).returning();

    res.status(201).json(school);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/schools/:schoolId", async (req: Request, res: Response) => {
  try {
    const [school] = await db
      .select()
      .from(schoolsTable)
      .where(eq(schoolsTable.id, (req.params.schoolId as string)));

    if (!school) {
      res.status(404).json({ error: "School not found" });
      return;
    }
    res.json(school);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.put("/schools/:schoolId", async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { name, type, country, state, city, address, phone, email, logoUrl, accreditationStatus } = req.body;

    const [school] = await db
      .update(schoolsTable)
      .set({
        ...(name && { name }),
        ...(type && { type }),
        ...(country && { country }),
        ...(state !== undefined && { state }),
        ...(city !== undefined && { city }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(accreditationStatus !== undefined && { accreditationStatus }),
        updatedAt: new Date(),
      })
      .where(eq(schoolsTable.id, (req.params.schoolId as string)))
      .returning();

    if (!school) {
      res.status(404).json({ error: "School not found" });
      return;
    }
    res.json(school);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
