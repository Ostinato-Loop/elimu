import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { classesTable, studentsTable } from "./academic";

export const attendanceRecordsTable = pgTable("attendance_records", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  status: text("status").notNull(),
  remarks: text("remarks"),
  recordedBy: text("recorded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAttendanceSchema = createInsertSchema(attendanceRecordsTable).omit({ createdAt: true });
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type AttendanceRecord = typeof attendanceRecordsTable.$inferSelect;
