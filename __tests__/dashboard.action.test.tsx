import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAdminDashboardData } from '@/app/admin/dashboard/action'
import prisma from '@/lib/prisma'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        book: {
            count: vi.fn(),
        },
        borrowing: {
            count: vi.fn(),
            findMany: vi.fn(),
        },
        user: {
            count: vi.fn(),
            findMany: vi.fn(),
        },
    },
}))

describe('Dashboard Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Test fetching dashboard statistics
    it('should return dashboard data', async () => {
        // Mock statistics
        vi.mocked(prisma.book.count).mockResolvedValue(100)

        vi.mocked(prisma.borrowing.count)
            .mockResolvedValueOnce(12) // active borrowings
            .mockResolvedValueOnce(3) // overdue books

        vi.mocked(prisma.user.count)
            .mockResolvedValueOnce(5) // new members
            .mockResolvedValueOnce(40) // total members

        // Mock recent loans
        vi.mocked(prisma.borrowing.findMany).mockResolvedValue([
            {
                id: 'loan-1',
            },
        ] as any)

        // Mock recent members
        vi.mocked(prisma.user.findMany).mockResolvedValue([
            {
                id: 'user-1',
                name: 'John',
                email: 'john@test.com',
            },
        ] as any)

        const result = await getAdminDashboardData()

        expect(result.stats.totalBooks).toBe(100)
        expect(result.stats.activeBorrowings).toBe(12)
        expect(result.stats.newMembers).toBe(5)
        expect(result.stats.overdueBooks).toBe(3)
        expect(result.stats.totalMembers).toBe(40)

        expect(result.recentLoans).toHaveLength(1)
        expect(result.recentMembers).toHaveLength(1)
    })

    // Check that Prisma methods are called
    it('should call Prisma queries', async () => {
        vi.mocked(prisma.book.count).mockResolvedValue(0)

        vi.mocked(prisma.borrowing.count)
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(0)

        vi.mocked(prisma.user.count)
            .mockResolvedValueOnce(0)
            .mockResolvedValueOnce(0)

        vi.mocked(prisma.borrowing.findMany).mockResolvedValue([])

        vi.mocked(prisma.user.findMany).mockResolvedValue([])

        await getAdminDashboardData()

        expect(prisma.book.count).toHaveBeenCalled()
        expect(prisma.borrowing.count).toHaveBeenCalledTimes(2)
        expect(prisma.user.count).toHaveBeenCalledTimes(2)
        expect(prisma.borrowing.findMany).toHaveBeenCalled()
        expect(prisma.user.findMany).toHaveBeenCalled()
    })
})
