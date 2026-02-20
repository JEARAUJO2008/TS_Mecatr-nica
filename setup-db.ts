import { db } from "./lib/db";

async function setup() {
    try {
        console.log("Creando tablas en Turso...");

        await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        documentType TEXT,
        documentNumber TEXT,
        institutionalEmail TEXT,
        title TEXT,
        objectives TEXT,
        specificObjectives TEXT,
        problemStatement TEXT,
        justification TEXT,
        demographicDescription TEXT,
        scope TEXT,
        hasAlly BOOLEAN,
        allyName TEXT,
        startDate TEXT,
        endDate TEXT,
        population INTEGER,
        students INTEGER,
        teachers INTEGER,
        studentHours INTEGER,
        teacherHours INTEGER,
        ods TEXT, -- JSON string
        interventionType TEXT,
        institutionalBudget INTEGER,
        allyBudget INTEGER,
        satisfactionLevel INTEGER,
        requiresMaintenance BOOLEAN,
        fileName TEXT,
        date TEXT
      )
    `);

        await db.execute(`
      CREATE TABLE IF NOT EXISTS approvals (
        id TEXT PRIMARY KEY,
        name TEXT,
        code TEXT,
        registrationDate TEXT,
        status TEXT
      )
    `);

        console.log("Tablas creadas exitosamente.");
    } catch (error) {
        console.error("Error al configurar la base de datos:", error);
    }
}

setup();
