"use client"

import { useState, useCallback } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  X,
  Star,
  Info,
  Target,
  Compass,
  DollarSign,
  CheckCircle2,
  AlertCircleIcon,
} from "lucide-react"
import type { Project } from "@/lib/types"
import { ODS_OPTIONS, INTERVENTION_TYPES } from "@/lib/types"

interface FormViewProps {
  onSubmit: (project: Project) => void
  userStatus?: "pending" | "approved" | "rejected"
}

/* ──────────── Star Rating ──────────── */
function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-110"
          aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`size-6 transition-colors ${star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-border"
              }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value > 0 ? `${value}/5` : "Sin calificar"}
      </span>
    </div>
  )
}

/* ──────────── Currency Input ──────────── */
function CurrencyInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        $
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder={placeholder || "0"}
        className="pl-7"
        value={value}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d]/g, "")
          if (!raw) {
            onChange("")
            return
          }
          onChange(Number(raw).toLocaleString("es-CO"))
        }}
      />
    </div>
  )
}

/* ──────────── Tab Navigation ──────────── */
const TABS = [
  { id: "general", label: "Informacion General", icon: Info },
  { id: "impact", label: "Esfuerzo e Impacto", icon: Target },
  { id: "strategic", label: "Alineacion Estrategica", icon: Compass },
  { id: "resources", label: "Recursos y Evaluacion", icon: DollarSign },
] as const

type TabId = (typeof TABS)[number]["id"]

export function FormView({ onSubmit, userStatus = "approved" }: FormViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("general")

  // Datos del responsable
  const [documentType, setDocumentType] = useState("")
  const [documentNumber, setDocumentNumber] = useState("")
  const [institutionalEmail, setInstitutionalEmail] = useState("")

  // Seccion 1: Informacion General
  const [title, setTitle] = useState("")
  const [objectives, setObjectives] = useState("")
  const [specificObjectives, setSpecificObjectives] = useState("")
  const [problemStatement, setProblemStatement] = useState("")
  const [justification, setJustification] = useState("")
  const [demographicDescription, setDemographicDescription] = useState("")
  const [scope, setScope] = useState<"Nacional" | "Internacional" | "">("")
  const [hasAlly, setHasAlly] = useState(false)
  const [allyName, setAllyName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Seccion 2: Esfuerzo e Impacto
  const [population, setPopulation] = useState("")
  const [students, setStudents] = useState("")
  const [teachers, setTeachers] = useState("")
  const [studentHours, setStudentHours] = useState("")
  const [teacherHours, setTeacherHours] = useState("")

  // Seccion 3: Alineacion Estrategica
  const [selectedOds, setSelectedOds] = useState<string[]>([])
  const [interventionType, setInterventionType] = useState("")

  // Seccion 4: Recursos y Evaluacion
  const [institutionalBudget, setInstitutionalBudget] = useState("")
  const [allyBudget, setAllyBudget] = useState("")
  const [satisfactionLevel, setSatisfactionLevel] = useState(0)
  const [requiresMaintenance, setRequiresMaintenance] = useState(false)

  const toggleOds = (ods: string) => {
    setSelectedOds((prev) =>
      prev.includes(ods) ? prev.filter((o) => o !== ods) : [...prev, ods]
    )
  }

  const parseCurrency = (val: string) =>
    Number(val.replace(/\./g, "").replace(/,/g, "")) || 0

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    if (
      !title ||
      !scope ||
      !documentType ||
      !documentNumber ||
      !institutionalEmail
    )
      return

    const project: Project = {
      id: Date.now().toString(),
      documentType,
      documentNumber,
      institutionalEmail,
      title,
      objectives,
      specificObjectives,
      problemStatement,
      justification,
      demographicDescription,
      scope: scope as "Nacional" | "Internacional",
      hasAlly,
      allyName: hasAlly ? allyName : "",
      startDate,
      endDate,
      population: Number(population) || 0,
      students: Number(students) || 0,
      teachers: Number(teachers) || 0,
      studentHours: Number(studentHours) || 0,
      teacherHours: Number(teacherHours) || 0,
      ods: selectedOds,
      interventionType,
      institutionalBudget: parseCurrency(institutionalBudget),
      allyBudget: parseCurrency(allyBudget),
      satisfactionLevel,
      requiresMaintenance,
      fileName: file?.name || "Sin archivo",
      date: new Date().toLocaleDateString("es-CO"),
    }

    onSubmit(project)

    // Reset
    setDocumentType("")
    setDocumentNumber("")
    setInstitutionalEmail("")
    setTitle("")
    setObjectives("")
    setSpecificObjectives("")
    setProblemStatement("")
    setJustification("")
    setDemographicDescription("")
    setScope("")
    setHasAlly(false)
    setAllyName("")
    setStartDate("")
    setEndDate("")
    setFile(null)
    setPopulation("")
    setStudents("")
    setTeachers("")
    setStudentHours("")
    setTeacherHours("")
    setSelectedOds([])
    setInterventionType("")
    setInstitutionalBudget("")
    setAllyBudget("")
    setSatisfactionLevel(0)
    setRequiresMaintenance(false)
    setActiveTab("general")
  }

  const tabIndex = TABS.findIndex((t) => t.id === activeTab)

  const goNext = () => {
    if (tabIndex < TABS.length - 1) setActiveTab(TABS[tabIndex + 1].id)
  }
  const goPrev = () => {
    if (tabIndex > 0) setActiveTab(TABS[tabIndex - 1].id)
  }

  return (
    <div className="flex flex-col gap-6">
      {userStatus === "approved" ? (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-200">
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-sm font-bold">Cuenta Aprobada</AlertTitle>
          <AlertDescription className="text-xs">
            Tu cuenta está aprobada. Ya puedes radicar tu informe de trabajo social de manera oficial.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200">
          <AlertCircleIcon className="size-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="text-sm font-bold">Cuenta pendiente de revisión</AlertTitle>
          <AlertDescription className="text-xs">
            Tu solicitud de acceso aún no ha sido procesada por el Coordinador. La radicación tendrá carácter provisional.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground text-balance">
          Carga de Trabajo Social
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra los informes finales de trabajo social del programa.
        </p>
      </div>

      {/* Datos del Responsable Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del Responsable</CardTitle>
          <CardDescription>
            Ingresa tus datos personales para el registro del informe.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Tipo de Documento</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cedula de Ciudadania (CC)</SelectItem>
                  <SelectItem value="CE">Cedula de Extranjeria (CE)</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad (TI)</SelectItem>
                  <SelectItem value="PP">Pasaporte (PP)</SelectItem>
                  <SelectItem value="NIT">NIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="doc-number">Numero de Documento</Label>
              <Input
                id="doc-number"
                placeholder="Ej: 1.023.456.789"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="inst-email">Correo Electronico Institucional</Label>
            <Input
              id="inst-email"
              type="email"
              placeholder="nombre.apellido@universidad.edu.co"
              value={institutionalEmail}
              onChange={(e) => setInstitutionalEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Project Info */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Informacion del Proyecto</CardTitle>
          <CardDescription>
            Completa cada seccion para registrar el informe.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1 mb-6">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* TAB: Informacion General */}
          {activeTab === "general" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              {/* File Upload */}
              <div>
                <Label className="mb-2 block">Informe Final (PDF)</Label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                >
                  {file ? (
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 size-7"
                        onClick={() => setFile(null)}
                      >
                        <X className="size-3.5" />
                        <span className="sr-only">Eliminar archivo</span>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="size-5 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Arrastra un archivo o{" "}
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer text-primary font-medium hover:text-primary/80"
                        >
                          busca aqui
                        </label>
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Titulo del Proyecto</Label>
                <Input
                  id="title"
                  placeholder="Ej: Mejoramiento de procesos industriales..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="objectives">Objetivo General</Label>
                <Textarea
                  id="objectives"
                  placeholder="Describa el objetivo general del proyecto..."
                  className="min-h-[80px] resize-y"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="specific-objectives">
                  Objetivos Especificos
                </Label>
                <Textarea
                  id="specific-objectives"
                  placeholder="Liste los objetivos especificos..."
                  className="min-h-[80px] resize-y"
                  value={specificObjectives}
                  onChange={(e) => setSpecificObjectives(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="problem-statement">
                  Planteamiento del Problema
                </Label>
                <Textarea
                  id="problem-statement"
                  placeholder="Describa la problematica que aborda..."
                  className="min-h-[80px] resize-y"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="justification">Justificacion</Label>
                <Textarea
                  id="justification"
                  placeholder="Explique la relevancia y pertinencia..."
                  className="min-h-[80px] resize-y"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="demographic-desc">
                  Descripcion Demografica
                </Label>
                <Textarea
                  id="demographic-desc"
                  placeholder="Poblacion objetivo: ubicacion, edad, condiciones socioeconomicas..."
                  className="min-h-[80px] resize-y"
                  value={demographicDescription}
                  onChange={(e) => setDemographicDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Alcance del Proyecto</Label>
                <Select
                  value={scope}
                  onValueChange={(val) =>
                    setScope(val as "Nacional" | "Internacional")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar alcance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nacional">Nacional</SelectItem>
                    <SelectItem value="Internacional">Internacional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="start-date">Fecha de Inicio</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="end-date">Fecha de Finalizacion</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Alliance */}
              <div className="rounded-lg border p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Switch
                    id="alliance"
                    checked={hasAlly}
                    onCheckedChange={setHasAlly}
                  />
                  <Label htmlFor="alliance" className="cursor-pointer">
                    Hubo entidad aliada
                  </Label>
                </div>
                {hasAlly && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Label htmlFor="ally-name">
                      Nombre de la Entidad o Universidad
                    </Label>
                    <Input
                      id="ally-name"
                      placeholder="Ej: Universidad Nacional, Empresa XYZ..."
                      value={allyName}
                      onChange={(e) => setAllyName(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: Esfuerzo e Impacto */}
          {activeTab === "impact" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="population">Poblacion Beneficiada</Label>
                  <Input
                    id="population"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={population}
                    onChange={(e) => setPopulation(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="students">Estudiantes Vinculados</Label>
                  <Input
                    id="students"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={students}
                    onChange={(e) => setStudents(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teachers">Docentes Vinculados</Label>
                  <Input
                    id="teachers"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={teachers}
                    onChange={(e) => setTeachers(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="student-hours">Total Horas Estudiante</Label>
                  <Input
                    id="student-hours"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={studentHours}
                    onChange={(e) => setStudentHours(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Horas acumuladas de todos los estudiantes.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="teacher-hours">Total Horas Docente</Label>
                  <Input
                    id="teacher-hours"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={teacherHours}
                    onChange={(e) => setTeacherHours(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Horas acumuladas de todos los docentes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Alineacion Estrategica */}
          {activeTab === "strategic" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div className="flex flex-col gap-2">
                <Label>
                  Objetivos de Desarrollo Sostenible (ODS)
                </Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Selecciona los ODS con los que se alinea el proyecto.
                </p>
                <div className="flex flex-wrap gap-2">
                  {ODS_OPTIONS.map((ods) => {
                    const isSelected = selectedOds.includes(ods)
                    return (
                      <button
                        key={ods}
                        type="button"
                        onClick={() => toggleOds(ods)}
                        className="transition-colors"
                      >
                        <Badge
                          variant={isSelected ? "default" : "outline"}
                          className={`cursor-pointer text-xs py-1.5 px-3 ${isSelected
                              ? ""
                              : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="size-3 mr-1" />
                          )}
                          {ods}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Tipo de Intervencion</Label>
                <Select
                  value={interventionType}
                  onValueChange={setInterventionType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo de intervencion" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVENTION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* TAB: Recursos y Evaluacion */}
          {activeTab === "resources" && (
            <div className="flex flex-col gap-5 animate-in fade-in duration-200">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="inst-budget">
                    Presupuesto Institucional (COP)
                  </Label>
                  <CurrencyInput
                    id="inst-budget"
                    value={institutionalBudget}
                    onChange={setInstitutionalBudget}
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ally-budget">
                    Contrapartida Aliado (COP)
                  </Label>
                  <CurrencyInput
                    id="ally-budget"
                    value={allyBudget}
                    onChange={setAllyBudget}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Nivel de Satisfaccion</Label>
                <StarRating
                  value={satisfactionLevel}
                  onChange={setSatisfactionLevel}
                />
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Switch
                    id="maintenance"
                    checked={requiresMaintenance}
                    onCheckedChange={setRequiresMaintenance}
                  />
                  <Label htmlFor="maintenance" className="cursor-pointer">
                    Requiere mantenimiento a futuro
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Tab Navigation Buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={tabIndex === 0}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1.5">
              {TABS.map((_, i) => (
                <div
                  key={i}
                  className={`size-2 rounded-full transition-colors ${i === tabIndex ? "bg-primary" : "bg-border"
                    }`}
                />
              ))}
            </div>

            {tabIndex < TABS.length - 1 ? (
              <Button onClick={goNext}>Siguiente</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  !title ||
                  !scope ||
                  !documentType ||
                  !documentNumber ||
                  !institutionalEmail
                }
              >
                Registrar Informe
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
