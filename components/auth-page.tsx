"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon, LockIcon, MailIcon, UserIcon, ShieldIcon } from "lucide-react"

interface AuthPageProps {
    onLogin: (role: "student" | "admin") => void
}

export function AuthPage({ onLogin }: AuthPageProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleAuth = (role: "student" | "admin") => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            onLogin(role)
            setIsLoading(false)
        }, 1000)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4 dark:bg-slate-950/50">
            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldIcon className="size-6" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Mechatronics Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Gestión de Trabajo Social - Programa de Mecatrónica
                    </p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 shadow-sm">
                        <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                        <TabsTrigger value="register">Registro</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader>
                                <CardTitle>Bienvenido de nuevo</CardTitle>
                                <CardDescription>
                                    Ingresa tus credenciales para acceder al panel.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Institucional</Label>
                                    <div className="relative">
                                        <MailIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input id="email" placeholder="nombre@unimecatronica.edu.co" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input id="password" type="password" className="pl-10" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-4">
                                <Button
                                    className="w-full font-semibold"
                                    onClick={() => handleAuth("admin")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Cargando..." : "Acceder como Admin"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full font-semibold"
                                    onClick={() => handleAuth("student")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Cargando..." : "Acceder como Estudiante"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader>
                                <CardTitle>Crea tu cuenta</CardTitle>
                                <CardDescription>
                                    Completa tus datos para solicitar acceso.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre Completo</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                            <Input id="name" placeholder="Ej. Juan Pérez" className="pl-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="code">Código Estudiantil</Label>
                                        <Input id="code" placeholder="2024XXXXX" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Correo Institucional</Label>
                                    <div className="relative">
                                        <MailIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input id="reg-email" placeholder="nombre@unimecatronica.edu.co" className="pl-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <div className="relative">
                                        <LockIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />
                                        <Input id="reg-password" type="password" className="pl-10" />
                                    </div>
                                </div>

                                <Alert className="bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-900/50">
                                    <InfoIcon className="size-4 text-amber-600 dark:text-amber-400" />
                                    <AlertDescription className="text-xs font-medium">
                                        Nota: El acceso al panel requiere la aprobación previa del Coordinador del Programa.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full font-semibold"
                                    onClick={() => handleAuth("student")}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Procesando..." : "Solicitar Registro"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>

                <p className="text-center text-xs text-muted-foreground">
                    &copy; 2026 Facultad de Ingeniería - Programa de Mecatrónica
                </p>
            </div>
        </div>
    )
}
