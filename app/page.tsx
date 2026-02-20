"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { FormView } from "@/components/dashboard/form-view"
import { AnalyticsView } from "@/components/dashboard/analytics-view"
import { ApprovalsView } from "@/components/dashboard/approvals-view"
import { AuthPage } from "@/components/auth-page"
import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { Toaster, toast } from "sonner"
import type { Project, User, Role } from "@/lib/types"
import { getProjects, createProject } from "@/lib/actions"
import { useEffect } from "react"

// SEED_PROJECTS moved to lib/actions.ts or used purely for static initial state if needed
const SEED_PROJECTS: Project[] = []

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [activeView, setActiveView] = useState<string>("form")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects()
      setProjects(data)
    }
    fetchProjects()
  }, [])

  const handleLogin = (role: Role) => {
    setIsAuthenticated(true)
    setUser({
      id: "1",
      name: role === "admin" ? "Coordinador Admin" : "Estudiante de Prueba",
      email: role === "admin" ? "admin@unimecatronica.edu.co" : "estudiante@unimecatronica.edu.co",
      role: role,
      status: "approved",
    })
    setActiveView(role === "admin" ? "analytics" : "form")
    toast.success(`Bienvenido, ${role === "admin" ? "Administrador" : "Estudiante"}`)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    toast.info("Sesión cerrada")
  }

  const handleRoleChange = (role: Role) => {
    setUser(prev => prev ? { ...prev, role } : null)
    setActiveView(role === "admin" ? "analytics" : "form")
    toast.success(`Vista cambiada a ${role}`)
  }

  const handleSubmit = async (project: Project) => {
    const result = await createProject(project)
    if (result.success) {
      setProjects((prev) => [project, ...prev])
      toast.success("Informe registrado exitosamente", {
        description: project.title,
      })
    } else {
      toast.error("Error al registrar el informe")
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    )
  }

  const renderContent = () => {
    switch (activeView) {
      case "analytics":
        return <AnalyticsView projects={projects} />
      case "approvals":
        return <ApprovalsView />
      case "form":
        return <FormView onSubmit={handleSubmit} userStatus={user.status} />
      case "history":
        return (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Historial de Informes</h2>
            <p className="text-muted-foreground">Lista completa de informes radicados.</p>
            {/* Simple list or logic for history could go here */}
            <div className="grid gap-4">
              {projects.map(p => (
                <div key={p.id} className="p-4 border rounded-lg bg-card">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">{p.institutionalEmail} - {p.date}</p>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return <FormView onSubmit={handleSubmit} userStatus={user.status} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        role={user.role}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {activeView === "form" ? "Cargar Informe" :
                activeView === "analytics" ? "Dashboard" :
                  activeView === "approvals" ? "Aprobaciones" : "Historial"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitcher
              userName={user.name}
              currentRole={user.role}
              onRoleChange={handleRoleChange}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 py-8">
          {renderContent()}
        </div>
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}
