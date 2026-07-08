'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Change the user's password using Better Auth
export async function changePassword(
    currentPassword: string,
    newPassword: string
) {
    try {
        await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true, // log out other devices on password change
            },
        })
        return { success: true, message: 'Password changed successfully' }
    } catch (error) {
        return { success: false, message: 'Current password is incorrect' }
    }
}
