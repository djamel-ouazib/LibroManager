import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserLoans } from '../app/dashboard/loans/action'
import prisma from '../lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        borrowing: {
            findMany: vi.fn(),
        },
    },
}))

describe('getUserLoans Server Action', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should return all loans for a user', async () => {
        // Fake loans returned by Prisma
        const mockLoans = [
            {
                id: 'loan-1',
                userId: 'user-1',
                status: 'BORROWED',

                book: {
                    id: 'book-1',
                    title: 'Clean Code',
                    author: 'Robert Martin',
                },
            },
        ]

        // Mock Prisma response
        vi.mocked(prisma.borrowing.findMany).mockResolvedValue(mockLoans as any)

        const result = await getUserLoans('user-1')

        // Check returned data
        expect(result).toEqual(mockLoans)

        // Check Prisma query
        expect(prisma.borrowing.findMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
            },
            include: {
                book: true,
            },
            orderBy: {
                borrowDate: 'desc',
            },
        })
    })

    it('should return an empty array when user has no loans', async () => {
        // Mock no loans
        vi.mocked(prisma.borrowing.findMany).mockResolvedValue([])

        const result = await getUserLoans('user-without-loans')

        expect(result).toEqual([])

        expect(prisma.borrowing.findMany).toHaveBeenCalledOnce()
    })
})
