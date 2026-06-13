import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { schoolsTable } from "./schools";

export const studentsTable = pgTable("students", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  studentNumber: text("student_number").notNull(),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  classId: text("class_id"),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  enrollmentDate: text("enrollment_date").notNull(),
  academicLevel: text("academic_level").notNull(),
  status: text("status").notNull().default("active"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const staffTable = pgTable("staff", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  staffNumber: text("staff_number").notNull(),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("teacher"),
  subjectIds: text("subject_ids").notNull().default("[]"),
  certifications: text("certifications").notNull().default("[]"),
  joinedDate: text("joined_date").notNull(),
  status: text("status").notNull().default("active"),
  profileImageUrl: text("profile_image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const parentsTable = pgTable("parents", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  occupation: text("occupation"),
  address: text("address"),
  childrenIds: text("children_ids").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const classesTable = pgTable("classes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id"),
  academicYear: text("academic_year").notNull(),
  academicTerm: text("academic_term"),
  academicLevel: text("academic_level").notNull(),
  studentCount: integer("student_count").notNull().default(0),
  roomNumber: text("room_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const subjectsTable = pgTable("subjects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  academicLevel: text("academic_level").notNull(),
  description: text("description"),
  creditUnits: integer("credit_units"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const classEnrollmentsTable = pgTable("class_enrollments", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  academicYear: text("academic_year").notNull(),
  status: text("status").notNull().default("active"),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
});

export const timetableEntriesTable = pgTable("timetable_entries", {
  id: text("id").primaryKey(),
  classId: text("class_id").notNull().references(() => classesTable.id, { onDelete: "cascade" }),
  subjectId: text("subject_id").notNull().references(() => subjectsTable.id, { onDelete: "cascade" }),
  teacherId: text("teacher_id"),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  room: text("room"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ createdAt: true, updatedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;

export const insertStaffSchema = createInsertSchema(staffTable).omit({ createdAt: true, updatedAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type Staff = typeof staffTable.$inferSelect;

export const insertParentSchema = createInsertSchema(parentsTable).omit({ createdAt: true, updatedAt: true });
export type InsertParent = z.infer<typeof insertParentSchema>;
export type ParentRecord = typeof parentsTable.$inferSelect;

export const insertClassSchema = createInsertSchema(classesTable).omit({ createdAt: true, updatedAt: true });
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classesTable.$inferSelect;

export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({ createdAt: true, updatedAt: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjectsTable.$inferSelect;
