"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  History,
} from "lucide-react"
import { Role } from "@/lib/types"

interface SidebarNavProps {
  activeView: string
  onViewChange: (view: any) => void
  collapsed: boolean
  onToggleCollapse: () => void
  role: Role
}

export function SidebarNav({
  activeView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  role,
}: SidebarNavProps) {
  const navItems = [
    {
      id: "analytics",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["admin"],
    },
    {
      id: "approvals",
      label: "Aprobaciones",
      icon: UserCheck,
      roles: ["admin"],
    },
    {
      id: "form",
      label: "Cargar Informe",
      icon: ClipboardList,
      roles: ["student", "admin"],
    },
    {
      id: "history",
      label: "Historial de Informes",
      icon: History,
      roles: ["admin"],
    },
  ].filter((item) => item.roles.includes(role))

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card/50 transition-all duration-300 ease-in-out",
        collapsed ? "w-[70px]" : "w-[260px]",
      )}
    >
      <div className="flex h-14 items-center gap-2 px-6 border-b">
        <div className="size-6 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xs">M</span>
        </div>
        {!collapsed && (
          <span className="font-bold tracking-tight text-foreground/90">
            Mechatronics<span className="text-primary font-black">.</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 px-3",
              activeView === item.id
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => onViewChange(item.id)}
          >
            <item.icon className="size-[18px] shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <ChevronLeft className="size-4" />
              <span className="font-medium">Contraer</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
