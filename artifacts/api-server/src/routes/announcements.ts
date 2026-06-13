import { Router, type Request, type Response } from "express";
import { db, announcementsTable } from "@workspace/db";
import { eq, and, desc, type SQL } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/schools/:schoolId/announcements", async (req: Request, res: Response) => {
  try {
    const { audience, page = "1", limit = "20" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions: SQL[] = [eq(announcementsTable.schoolId, req.params.schoolId)];
    if (audience) conditions.push(eq(announcementsTable.audience, audience));

    const all = await db
      .select()
      .from(announcementsTable)
      .where(and(...conditions))
      .orderBy(desc(announcementsTable.publishedAt));

    const announcements = all.slice(offset, offset + limitNum);
    res.json({ announcements, total: all.length, page: pageNum, limit: limitNum });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.post("/schools/:schoolId/announcements", async (req: Request, res: Response) => {
  try {
    const { title, body, audience, publishedAt } = req.body;
    if (!title || !body || !audience) {
      res.status(400).json({ error: "title, body, and audience are required" });
      return;
    }

    const authorId = (req as any).user?.id || "system";
    const authorName = (req as any).user
      ? `${(req as any).user.firstName || ""} ${(req as any).user.lastName || ""}`.trim() || null
      : null;

    const [announcement] = await db.insert(announcementsTable).values({
      id: randomUUID(),
      schoolId: req.params.schoolId,
      authorId,
      authorName,
      title,
      body,
      audience,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    }).returning();

    res.status(201).json(announcement);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.get("/announcements/:announcementId", async (req: Request, res: Response) => {
  try {
    const [announcement] = await db
      .select()
      .from(announcementsTable)
      .where(eq(announcementsTable.id, req.params.announcementId));
    if (!announcement) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }
    res.json(announcement);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

router.delete("/announcements/:announcementId", async (req: Request, res: Response) => {
  try {
    await db.delete(announcementsTable).where(eq(announcementsTable.id, req.params.announcementId));
    res.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

export default router;
