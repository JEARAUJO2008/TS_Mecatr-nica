"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Project } from "@/lib/types"
import { ODS_OPTIONS, INTERVENTION_TYPES } from "@/lib/types"

interface AnalyticsViewProps {
  projects: Project[]
}

const CHART_COLORS = {
  primary: "oklch(0.45 0.18 260)",
  secondary: "oklch(0.6 0.15 175)",
  accent: "oklch(0.55 0.2 40)",
  muted: "oklch(0.7 0.15 145)",
  highlight: "oklch(0.65 0.12 300)",
}

const STACKED_COLORS = [
  "oklch(0.45 0.18 260)",
  "oklch(0.6 0.15 175)",
  "oklch(0.55 0.2 40)",
  "oklch(0.7 0.15 145)",
  "oklch(0.65 0.12 300)",
  "oklch(0.5 0.15 200)",
]

export function AnalyticsView({ projects }: AnalyticsViewProps) {
  const totalPopulation = projects.reduce((a, b) => a + b.population, 0)
  const totalStudents = projects.reduce((a, b) => a + b.students, 0)
  const totalTeachers = projects.reduce((a, b) => a + b.teachers, 0)
  const totalStudentHours = projects.reduce(
    (a, b) => a + (b.studentHours || 0),
    0
  )
  const totalTeacherHours = projects.reduce(
    (a, b) => a + (b.teacherHours || 0),
    0
  )
  const totalInstitutionalBudget = projects.reduce(
    (a, b) => a + (b.institutionalBudget || 0),
    0
  )
  const totalAllyBudget = projects.reduce(
    (a, b) => a + (b.allyBudget || 0),
    0
  )
  const totalBudget = totalInstitutionalBudget + totalAllyBudget
  const totalHours = totalStudentHours + totalTeacherHours

  // ROI Social: population impacted per million COP invested
  const roiSocial =
    totalBudget > 0
      ? ((totalPopulation / (totalBudget / 1_000_000)) ).toFixed(1)
      : "N/A"

  const national = projects.filter((p) => p.scope === "Nacional").length
  const international = projects.filter(
    (p) => p.scope === "Internacional"
  ).length

  const pieData = [
    { name: "Nacional", value: national || 0 },
    { name: "Internacional", value: international || 0 },
  ]

  const barData = projects.slice(-6).map((p) => ({
    name: p.title.length > 18 ? p.title.slice(0, 18) + "..." : p.title,
    Estudiantes: p.students,
    Poblacion: p.population,
  }))

  const lineData = projects.slice(-6).map((p) => ({
    name: p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title,
    Docentes: p.teachers,
    Estudiantes: p.students,
  }))

  // Radar data: count how many projects align with each ODS
  const SHORT_ODS = [
    "Pobreza",
    "Salud",
    "Educacion",
    "Agua",
    "Energia",
    "Industria",
    "Desigualdades",
    "Ciudades",
    "Produccion",
    "Clima",
  ]
  const radarData = ODS_OPTIONS.map((ods, i) => ({
    subject: SHORT_ODS[i],
    count: projects.filter((p) => p.ods && p.ods.includes(ods)).length,
    fullMark: Math.max(projects.length, 1),
  }))

  // Stacked bar: projects per intervention type
  const interventionData = INTERVENTION_TYPES.map((type) => ({
    name:
      type.length > 16 ? type.slice(0, 16) + "..." : type,
    Proyectos: projects.filter((p) => p.interventionType === type).length,
  }))

  const kpis = [
    {
      title: "Total Proyectos",
      value: projects.length,
      icon: FolderOpen,
      change: "+2 este mes",
    },
    {
      title: "Poblacion Beneficiada",
      value: totalPopulation.toLocaleString("es-CO"),
      icon: Users,
      change: "+12% vs anterior",
    },
    {
      title: "Estudiantes Vinculados",
      value: totalStudents.toLocaleString("es-CO"),
      icon: GraduationCap,
      change: `${totalStudentHours.toLocaleString("es-CO")} horas`,
    },
    {
      title: "Docentes Vinculados",
      value: totalTeachers.toLocaleString("es-CO"),
      icon: BookOpen,
      change: `${totalTeacherHours.toLocaleString("es-CO")} horas`,
    },
    {
      title: "ROI Social",
      value: roiSocial === "N/A" ? "N/A" : `${roiSocial}`,
      icon: DollarSign,
      change:
        roiSocial === "N/A"
          ? "Sin presupuesto"
          : "Beneficiarios / millon COP",
    },
  ]

  const tooltipStyle = {
    background: "oklch(1 0 0)",
    border: "1px solid oklch(0.91 0.01 250)",
    borderRadius: "8px",
    fontSize: "12px",
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground text-balance">
          Informe de Impacto y Estadisticas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen visual de los datos del programa de trabajo social.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {kpi.title}
                  </span>
                  <span className="text-2xl font-bold text-foreground">
                    {kpi.value}
                  </span>
                </div>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <kpi.icon className="size-5 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="size-3 text-chart-2" />
                <span>{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Impacto por Proyecto</CardTitle>
            <CardDescription>
              Estudiantes vinculados vs. poblacion beneficiada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.91 0.01 250)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0.02 260)"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0.02 260)"
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="Estudiantes"
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Poblacion"
                    fill={CHART_COLORS.secondary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribucion de Alcance</CardTitle>
            <CardDescription>
              Porcentaje de proyectos nacionales vs. internacionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill={CHART_COLORS.primary} />
                    <Cell fill={CHART_COLORS.accent} />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Radar + Stacked Bar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart: ODS Alignment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Alineacion con los ODS
            </CardTitle>
            <CardDescription>
              Numero de proyectos alineados a cada Objetivo de Desarrollo
              Sostenible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData} cx="50%" cy="50%">
                  <PolarGrid stroke="oklch(0.91 0.01 250)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "oklch(0.5 0.02 260)" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    tick={{ fontSize: 10 }}
                    stroke="oklch(0.85 0.01 250)"
                  />
                  <Radar
                    name="Proyectos"
                    dataKey="count"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </CardContent>
        </Card>

        {/* Stacked Bar Chart: Intervention Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tipo de Intervencion
            </CardTitle>
            <CardDescription>
              Distribucion de proyectos segun el tipo de intervencion realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={interventionData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.91 0.01 250)"
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0.02 260)"
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    stroke="oklch(0.5 0.02 260)"
                    width={120}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="Proyectos" radius={[0, 4, 4, 0]}>
                    {interventionData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STACKED_COLORS[index % STACKED_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChartState />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Participacion Academica</CardTitle>
          <CardDescription>
            Comparacion de docentes y estudiantes en los ultimos proyectos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(0.91 0.01 250)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0.02 260)"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="oklch(0.5 0.02 260)"
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="Docentes"
                  stroke={CHART_COLORS.accent}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.accent, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Estudiantes"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState />
          )}
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proyectos Recientes</CardTitle>
          <CardDescription>
            Ultimos informes de trabajo social registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Alcance</TableHead>
                    <TableHead>Intervencion</TableHead>
                    <TableHead>Entidad Aliada</TableHead>
                    <TableHead className="text-right">Poblacion</TableHead>
                    <TableHead className="text-right">Informe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects
                    .slice()
                    .reverse()
                    .map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="max-w-[200px] truncate font-medium">
                          {project.title}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.scope === "Internacional"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {project.scope}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {project.interventionType || "N/A"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {project.hasAlly ? project.allyName : "N/A"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {project.population.toLocaleString("es-CO")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-primary"
                          >
                            <FileText className="size-3.5" />
                            Ver PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted mb-3">
                <FolderOpen className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Sin proyectos registrados
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Los proyectos apareceran aqui una vez los registres.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function EmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-muted mb-3">
        <FolderOpen className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Sin datos disponibles
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Registra un proyecto para ver las estadisticas.
      </p>
    </div>
  )
}
