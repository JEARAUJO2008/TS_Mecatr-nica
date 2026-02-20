"use client"

import { useState, useEffect } from "react"
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
import { CheckIcon, XIcon, UserCheckIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { StudentApproval } from "@/lib/types"
import { toast } from "sonner"
import { getApprovals, updateApprovalStatus } from "@/lib/actions"

export function ApprovalsView() {
    const [approvals, setApprovals] = useState<StudentApproval[]>([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        const fetchApprovals = async () => {
            const data = await getApprovals()
            setApprovals(data)
        }
        fetchApprovals()
    }, [])

    const handleAction = async (id: string, action: "approved" | "rejected") => {
        const result = await updateApprovalStatus(id, action)
        if (result.success) {
            setApprovals(prev => prev.map(a =>
                a.id === id ? { ...a, status: action } : a
            ))
            toast.success(action === "approved" ? "Estudiante aprobado" : "Solicitud rechazada", {
                description: `El estado del estudiante ha sido actualizado correctamente.`
            })
        } else {
            toast.error("Error al actualizar el estado")
        }
    }

    const filtered = approvals.filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.code.includes(search)
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight">Aprobaciones</h2>
                <p className="text-muted-foreground text-sm">
                    Gestione las solicitudes de acceso de nuevos estudiantes al panel.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <SearchIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o código..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold">Nombre</TableHead>
                            <TableHead className="font-semibold">Código</TableHead>
                            <TableHead className="font-semibold">Fecha de Registro</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                            <TableHead className="text-right font-semibold">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((student) => (
                            <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell className="text-muted-foreground">{student.code}</TableCell>
                                <TableCell className="text-muted-foreground">{student.registrationDate}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            student.status === "approved" ? "default" :
                                                student.status === "rejected" ? "destructive" : "outline"
                                        }
                                        className="capitalize"
                                    >
                                        {student.status === "pending" ? "Pendiente" :
                                            student.status === "approved" ? "Aprobado" : "Rechazado"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {student.status === "pending" ? (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                onClick={() => handleAction(student.id, "approved")}
                                            >
                                                <CheckIcon className="size-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="size-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                onClick={() => handleAction(student.id, "rejected")}
                                            >
                                                <XIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground italic">
                                            Procesado
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No se encontraron solicitudes.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
