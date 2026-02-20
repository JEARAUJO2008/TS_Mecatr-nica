"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { UserIcon, ShieldCheckIcon, LogOutIcon, ChevronDownIcon } from "lucide-react"
import { Role } from "@/lib/types"

interface RoleSwitcherProps {
    currentRole: Role
    onRoleChange: (role: Role) => void
    onLogout: () => void
    userName: string
}

export function RoleSwitcher({ currentRole, onRoleChange, onLogout, userName }: RoleSwitcherProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                    <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden text-xs font-medium md:inline-block">
                        {currentRole === "admin" ? "Admin" : "Estudiante"}
                    </span>
                    <ChevronDownIcon className="size-3 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                    <span className="text-sm font-semibold">{userName}</span>
                    <span className="text-xs text-muted-foreground capitalize">{currentRole}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-1.5">
                    Simular Rol
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onRoleChange("student")} className="gap-2">
                    <UserIcon className="size-4" />
                    <span>Ver como Estudiante</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onRoleChange("admin")} className="gap-2">
                    <ShieldCheckIcon className="size-4" />
                    <span>Ver como Admin</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="gap-2 text-destructive focus:text-destructive">
                    <LogOutIcon className="size-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
