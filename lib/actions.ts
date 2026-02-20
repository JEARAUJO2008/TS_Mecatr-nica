"use server"

import { db } from "./db";
import { Project, StudentApproval } from "./types";
import { revalidatePath } from "next/cache";

export async function getProjects(): Promise<Project[]> {
    try {
        const result = await db.execute("SELECT * FROM projects ORDER BY date DESC");
        return result.rows.map((row: any) => ({
            ...row,
            hasAlly: Boolean(row.hasAlly),
            requiresMaintenance: Boolean(row.requiresMaintenance),
            ods: JSON.parse(row.ods || "[]"),
        })) as Project[];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function createProject(project: Project) {
    try {
        await db.execute({
            sql: `
        INSERT INTO projects (
          id, documentType, documentNumber, institutionalEmail, title, 
          objectives, specificObjectives, problemStatement, justification, 
          demographicDescription, scope, hasAlly, allyName, startDate, 
          endDate, population, students, teachers, studentHours, 
          teacherHours, ods, interventionType, institutionalBudget, 
          allyBudget, satisfactionLevel, requiresMaintenance, fileName, date
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `,
            args: [
                project.id,
                project.documentType,
                project.documentNumber,
                project.institutionalEmail,
                project.title,
                project.objectives,
                project.specificObjectives,
                project.problemStatement,
                project.justification,
                project.demographicDescription,
                project.scope,
                project.hasAlly ? 1 : 0,
                project.allyName,
                project.startDate,
                project.endDate,
                project.population,
                project.students,
                project.teachers,
                project.studentHours,
                project.teacherHours,
                JSON.stringify(project.ods),
                project.interventionType,
                project.institutionalBudget,
                project.allyBudget,
                project.satisfactionLevel,
                project.requiresMaintenance ? 1 : 0,
                project.fileName,
                project.date,
            ],
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error };
    }
}

export async function getApprovals(): Promise<StudentApproval[]> {
    try {
        const result = await db.execute("SELECT * FROM approvals ORDER BY registrationDate DESC");
        return result.rows as unknown as StudentApproval[];
    } catch (error) {
        console.error("Error fetching approvals:", error);
        return [];
    }
}

export async function updateApprovalStatus(id: string, status: "pending" | "approved" | "rejected") {
    try {
        await db.execute({
            sql: "UPDATE approvals SET status = ? WHERE id = ?",
            args: [status, id],
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error updating approval status:", error);
        return { success: false, error };
    }
}

export async function createApproval(approval: StudentApproval) {
    try {
        await db.execute({
            sql: "INSERT INTO approvals (id, name, code, registrationDate, status) VALUES (?, ?, ?, ?, ?)",
            args: [approval.id, approval.name, approval.code, approval.registrationDate, approval.status],
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error creating approval:", error);
        return { success: false, error };
    }
}
