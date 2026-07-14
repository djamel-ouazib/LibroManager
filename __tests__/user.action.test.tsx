import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
    createUser,
    updateUserStatus,
} from '@/app/admin/dashboard/users/action'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        user: {
            update: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        account: {
            create: vi.fn(),
        },
    },
}))

// Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// Mock next headers
vi.mock('next/headers', () => ({
    headers: vi.fn(),
}))

// Mock Better Auth
vi.mock('@/lib/auth', () => ({
    auth: {
        api: {
            getSession: vi.fn(),
        },
        $context: Promise.resolve({
            password: {
                hash: vi.fn().mockResolvedValue('hashed-password'),
            },
        }),
    },
}))

describe('Users Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // -----------------------------
    // updateUserStatus
    // -----------------------------

    it('should update user status', async () => {
        vi.mocked(prisma.user.update).mockResolvedValue({} as any)

        await updateUserStatus('user-1', 'ACTIVE')

        expect(prisma.user.update).toHaveBeenCalled()

        expect(revalidatePath).toHaveBeenCalledWith('/admin/dashboard/users')
    })

    // -----------------------------
    // createUser
    // -----------------------------

    it('should return Unauthorized when user is not admin', async () => {
        vi.mocked(auth.api.getSession).mockResolvedValue(null)

        const formData = new FormData()
        formData.append('name', 'John')
        formData.append('email', 'john@test.com')
        formData.append('password', 'password123')

        const result = await createUser(formData)

        expect(result).toEqual({
            success: false,
            message: 'Unauthorized',
        })
    })

    it('should return error if email already exists', async () => {
        vi.mocked(auth.api.getSession).mockResolvedValue({
            user: {
                role: 'ADMIN',
            },
        } as any)

        vi.mocked(prisma.user.findUnique).mockResolvedValue({
            id: '1',
        } as any)

        const formData = new FormData()
        formData.append('name', 'John')
        formData.append('email', 'john@test.com')
        formData.append('password', 'password123')

        const result = await createUser(formData)

        expect(result).toEqual({
            success: false,
            message: 'Email already exists',
        })
    })

    it('should create a new user', async () => {
        vi.mocked(auth.api.getSession).mockResolvedValue({
            user: {
                role: 'ADMIN',
            },
        } as any)

        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        vi.mocked(prisma.user.create).mockResolvedValue({
            id: 'user-1',
        } as any)

        vi.mocked(prisma.account.create).mockResolvedValue({} as any)

        const formData = new FormData()
        formData.append('name', 'John')
        formData.append('email', 'john@test.com')
        formData.append('password', 'password123')

        const result = await createUser(formData)

        expect(result).toEqual({
            success: true,
            message: 'Member created successfully',
        })

        expect(prisma.user.create).toHaveBeenCalled()

        expect(prisma.account.create).toHaveBeenCalled()

        expect(revalidatePath).toHaveBeenCalledWith('/admin/dashboard/users')
    })
})
