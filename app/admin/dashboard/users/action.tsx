'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Status } from '@/app/generated/prisma/enums'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Update a user's status (ACTIVE, BANNED, PENDING)
// Update a user's status and sync with Better Auth ban field
export async function updateUserStatus(userId: string, status: Status) {
    await prisma.user.update({
        where: { id: userId },
        data: {
            status,
            // Sync Better Auth banned field to block login when status is BANNED
            banned: status === 'BANNED',
            banReason: status === 'BANNED' ? 'Banned by admin' : null,
            // Clear ban fields when status is restored to ACTIVE or PENDING
            banExpires: null,
        },
    })

    revalidatePath('/admin/dashboard/users')
}

// Create a new member using Better Auth admin API
// Create a new member directly via Prisma — Better Auth role mismatch workaround
export async function createUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        // Verify the requester is an admin
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session || session.user.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized' }
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        })
        if (existing) {
            return { success: false, message: 'Email already exists' }
        }

        // Hash password using Better Auth internal hasher
        const ctx = await auth.$context
        const hashedPassword = await ctx.password.hash(password)

        // Create the user record
        const user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                name,
                email,
                emailVerified: false,
                role: 'USER',
                status: 'ACTIVE',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        // Create the credentials account linked to the user
        await prisma.account.create({
            data: {
                id: crypto.randomUUID(),
                userId: user.id,
                accountId: user.id,
                providerId: 'credential',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })

        revalidatePath('/admin/dashboard/users')
        return { success: true, message: 'Member created successfully' }
    } catch (error) {
        console.error('createUser error:', error)
        return { success: false, message: 'Failed to create member' }
    }
}
