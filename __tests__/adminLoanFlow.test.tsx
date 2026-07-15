import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── MOCKS ─────────────────────────────────────────────────

// Mock Prisma to avoid real DB calls
vi.mock('@/lib/prisma', () => ({
    default: {
        borrowing: {
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        book: {
            update: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

import prisma from '@/lib/prisma'
import {
    markAsReturned,
    markAsOverdue,
} from '@/app/admin/dashboard/loans/action'

// ── MOCK DATA ─────────────────────────────────────────────

const activeLoan = {
    id: 'loan-1',
    userId: 'user-123',
    bookId: 'book-1',
    borrowDate: new Date(),
    dueDate: new Date(),
    returnDate: null,
    status: 'BORROWED' as const,
}

// ── INTEGRATION TESTS — ADMIN LOAN FLOW ──────────────────

describe('Integration — Admin Loan Management Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ── TEST A01 — Mark as returned ───────────────────────
    it('A01 — markAsReturned updates status and increments stock', async () => {
        // Simulate finding an active loan
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue(activeLoan)
        vi.mocked(prisma.$transaction).mockResolvedValue(undefined)

        const result = await markAsReturned('loan-1')

        // Transaction must be called
        expect(prisma.$transaction).toHaveBeenCalled()
        expect(result.success).toBe(true)
    })

    // ── TEST A02 — Mark already returned loan ─────────────
    it('A02 — markAsReturned fails if loan already returned', async () => {
        // Simulate a loan already returned
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue({
            ...activeLoan,
            status: 'RETURNED' as const,
            returnDate: new Date(),
        })

        const result = await markAsReturned('loan-1')

        // Should fail — loan already returned
        expect(result.success).toBe(false)
        expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    // ── TEST A03 — Mark non-existent loan ─────────────────
    it('A03 — markAsReturned fails if loan does not exist', async () => {
        // Simulate loan not found
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue(null)

        const result = await markAsReturned('fake-loan-id')

        expect(result.success).toBe(false)
        expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    // ── TEST A04 — Mark as overdue ────────────────────────
    it('A04 — markAsOverdue updates loan status to OVERDUE', async () => {
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue(activeLoan)
        vi.mocked(prisma.borrowing.update).mockResolvedValue({
            ...activeLoan,
            status: 'OVERDUE' as const,
        })

        const result = await markAsOverdue('loan-1')

        // Borrowing update must be called with OVERDUE status
        expect(prisma.borrowing.update).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'loan-1' },
                data: expect.objectContaining({ status: 'OVERDUE' }),
            })
        )
        expect(result.success).toBe(true)
    })

    // ── TEST A05 — Mark non-existent loan as overdue ──────
    it('A05 — markAsOverdue fails if loan does not exist', async () => {
        vi.mocked(prisma.borrowing.findUnique).mockResolvedValue(null)

        const result = await markAsOverdue('fake-loan-id')

        expect(result.success).toBe(false)
        expect(prisma.borrowing.update).not.toHaveBeenCalled()
    })
})
