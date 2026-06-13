import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { schoolsTable } from "./schools";
import { studentsTable } from "./academic";

export const feeStructuresTable = pgTable("fee_structures", {
  id: text("id").primaryKey(),
  schoolId: text("school_id").notNull().references(() => schoolsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").notNull().default("NGN"),
  academicYear: text("academic_year").notNull(),
  academicTerm: text("academic_term"),
  academicLevel: text("academic_level").notNull(),
  dueDate: text("due_date"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const feePaymentsTable = pgTable("fee_payments", {
  id: text("id").primaryKey(),
  feeStructureId: text("fee_structure_id").notNull().references(() => feeStructuresTable.id, { onDelete: "cascade" }),
  studentId: text("student_id").notNull().references(() => studentsTable.id, { onDelete: "cascade" }),
  amountPaid: real("amount_paid").notNull(),
  currency: text("currency").notNull().default("NGN"),
  paymentMethod: text("payment_method").notNull(),
  reference: text("reference").notNull(),
  status: text("status").notNull().default("pending"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeeStructureSchema = createInsertSchema(feeStructuresTable).omit({ createdAt: true, updatedAt: true });
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type FeeStructure = typeof feeStructuresTable.$inferSelect;

export const insertFeePaymentSchema = createInsertSchema(feePaymentsTable).omit({ createdAt: true });
export type InsertFeePayment = z.infer<typeof insertFeePaymentSchema>;
export type FeePayment = typeof feePaymentsTable.$inferSelect;
