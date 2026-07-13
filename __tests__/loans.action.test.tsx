import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    getAllLoans,
    markAsReturned,
    markAsOverdue,
} from '@/app/admin/dashboard/loans/action'

import prisma from '@/lib/prisma'

// Mock Prisma because we don't want to use the real database
vi.mock('@/lib/prisma', () => ({
    default: {
        borrowing: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        book: {
            update: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

describe('Loans Server Actions', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks()
    })

    // Test fetching all loans
    it('should return all loans with book and user details', async () => {
        const fakeLoans = [
            {
                id: 'loan-1',
                status: 'BORROWED',
                book: {
                    title: 'Clean Code',
                },
                user: {
                    name: 'John',
                },
            },
        ]

        // Mock Prisma response
        vi.mocked(prisma.borrowing.findMany).mockResolvedValue(fakeLoans as any)

        const result = await getAllLoans()

        // Check returned data
        expect(result).toEqual(fakeLoans)

        // Check Prisma query
        expect(prisma.borrowing.findMany).toHaveBeenCalledWith({
            include: {
                book: true,
                user: true,
            },
            orderBy: {
                borrowDate: 'desc',
            },
        })
    })

    // Test returning a loan that does not exist
    it('should return error when loan does not exist', async () => {
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue(null)

        const result = await markAsReturned('unknown-id')

        expect(result).toEqual({
            success: false,
            message: 'Loan not found',
        })
    })

    // Test returning a loan already returned
    it('should not return a loan already returned', async () => {
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue({
            id: 'loan-1',
            status: 'RETURNED',
            bookId: 'book-1',
        } as any)

        const result = await markAsReturned('loan-1')

        expect(result).toEqual({
            success: false,
            message: 'Already returned',
        })
    })

    // Test successful loan return
    it('should mark loan as returned and update stock', async () => {
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue({
            id: 'loan-1',
            status: 'BORROWED',
            bookId: 'book-1',
        } as any)

        // Mock Prisma transaction
        vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
            const tx = {
                borrowing: {
                    update: vi.fn(),
                },
                book: {
                    update: vi.fn(),
                },
            }

            return callback(tx as any)
        })

        const result = await markAsReturned('loan-1')

        expect(result).toEqual({
            success: true,
            message: 'Marked as returned',
        })

        expect(prisma.$transaction).toHaveBeenCalled()
    })

    // Test marking a loan as overdue
    it('should mark a loan as overdue', async () => {
        vi.mocked(prisma.borrowing.update).mockResolvedValue({} as any)

        const result = await markAsOverdue('loan-1')

        expect(result).toEqual({
            success: true,
            message: 'Marked as overdue',
        })

        expect(prisma.borrowing.update).toHaveBeenCalledWith({
            where: {
                id: 'loan-1',
            },
            data: {
                status: 'OVERDUE',
            },
        })
    })

    // Test server error handling
    it('should return server error when Prisma fails', async () => {
        vi.mocked(prisma.borrowing.update).mockRejectedValue(
            new Error('Database error')
        )

        const result = await markAsOverdue('loan-1')

        expect(result).toEqual({
            success: false,
            message: 'Server error',
        })
    })
})
