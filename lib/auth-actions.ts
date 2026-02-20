"use server"

import bcrypt from "bcryptjs";

export async function verifyAdminPassword(password: string) {
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
        console.error("ADMIN_PASSWORD_HASH is not defined in environment variables");
        return { success: false, error: "Error de configuración del servidor" };
    }

    try {
        const isValid = await bcrypt.compare(password, adminHash);
        return { success: isValid };
    } catch (error) {
        console.error("Error verifying password:", error);
        return { success: false, error: "Error al verificar la contraseña" };
    }
}
