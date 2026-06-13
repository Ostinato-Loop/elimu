import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable, subjectsTable, studentsTable } from "./academic";

export const assessmentsTable = pgTable("assessments", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjectsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(),
  maxScore: real("max_score").notNull(),
  weight: real("weight"),
  date: text("date"),
  academicYear: text("academic_year").notNull(),
  academicTerm: text("academic_term"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const assessmentResultsTable = pgTable("assessment_results", {
  id: text("id").primaryKey(),
  assessmentId: text("assessment_id").notNull().references(() => assessmentsTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  score: real("score").notNull(),
  grade: text("grade"),
  remarks: text("remarks"),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessmentsTable).omit({ createdAt: true, updatedAt: true });
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessmentsTable.$inferSelect;

export const insertAssessmentResultSchema = createInsertSchema(assessmentResultsTable).omit({ createdAt: true, updatedAt: true });
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type AssessmentResult = typeof assessmentResultsTable.$inferSelect;
