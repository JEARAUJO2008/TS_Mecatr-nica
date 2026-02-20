import { db } from "./lib/db";

async function verify() {
    try {
        console.log("Verificando datos en Turso...");

        const projects = await db.execute("SELECT COUNT(*) as count FROM projects");
        console.log("Total de proyectos:", projects.rows[0].count);

        const approvals = await db.execute("SELECT COUNT(*) as count FROM approvals");
        console.log("Total de aprobaciones:", approvals.rows[0].count);

        console.log("Verificación completada.");
    } catch (error) {
        console.error("Error en la verificación:", error);
    }
}

verify();
