import { pgTable, text, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./academic";
import { schoolsTable } from "./schools";

export const credentialsTable = pgTable("credentials", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  studentName: text("student_name"),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  schoolName: text("school_name"),
  type: text("type").notNull(),
  title: text("title").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  verificationHash: text("verification_hash").notNull().unique(),
  verified: boolean("verified").notNull().default(true),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCredentialSchema = createInsertSchema(credentialsTable).omit({ createdAt: true });
export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type Credential = typeof credentialsTable.$inferSelect;
