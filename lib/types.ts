export const ODS_OPTIONS = [
  "ODS 1: Fin de la Pobreza",
  "ODS 3: Salud y Bienestar",
  "ODS 4: Educacion de Calidad",
  "ODS 6: Agua Limpia y Saneamiento",
  "ODS 7: Energia Asequible",
  "ODS 9: Industria, Innovacion e Infraestructura",
  "ODS 10: Reduccion de las Desigualdades",
  "ODS 11: Ciudades Sostenibles",
  "ODS 12: Produccion Responsable",
  "ODS 13: Accion por el Clima",
] as const

export const INTERVENTION_TYPES = [
  "Transferencia tecnologica",
  "Capacitacion",
  "Desarrollo de prototipos",
  "Consultoria tecnica",
  "Investigacion aplicada",
  "Acompañamiento comunitario",
] as const

export type Role = "student" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  studentCode?: string
  status: "pending" | "approved" | "rejected"
}

export interface StudentApproval {
  id: string
  name: string
  code: string
  registrationDate: string
  status: "pending" | "approved" | "rejected"
}

export interface Project {
  id: string
  // Datos del responsable
  documentType: string
  documentNumber: string
  institutionalEmail: string
  // Seccion 1: Informacion General
  title: string
  objectives: string
  specificObjectives: string
  problemStatement: string
  justification: string
  demographicDescription: string
  scope: "Nacional" | "Internacional"
  hasAlly: boolean
  allyName: string
  startDate: string
  endDate: string
  // Seccion 2: Esfuerzo e Impacto
  population: number
  students: number
  teachers: number
  studentHours: number
  teacherHours: number
  // Seccion 3: Alineacion Estrategica
  ods: string[]
  interventionType: string
  // Seccion 4: Recursos y Evaluacion
  institutionalBudget: number
  allyBudget: number
  satisfactionLevel: number
  requiresMaintenance: boolean
  // Meta
  fileName: string
  date: string
}
