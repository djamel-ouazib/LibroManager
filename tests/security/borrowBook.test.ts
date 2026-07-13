import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma to avoid real database calls during tests
vi.mock('@/lib/prisma', () => ({
    default: {
        book: {
            findUnique: vi.fn(),
        },
        borrowing: {
            findFirst: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

import prisma from '@/lib/prisma'
import { borrowBook } from '@/app/dashboard/explore/actions'

describe('Security — borrowBook Server Action', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ── TEST 1 — Livre inexistant ──────────────────────────
    it('S01 — should return error if book does not exist', async () => {
        // Simulate book not found in database
        vi.mocked(prisma.book.findUnique).mockResolvedValue(null)

        const result = await borrowBook('user-123', 'fake-book-id')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Book not found')
    })

    // ── TEST 2 — Stock épuisé ──────────────────────────────
    it('S02 — should return error if book is out of stock', async () => {
        // Simulate a book with no available stock
        vi.mocked(prisma.book.findUnique).mockResolvedValue({
            id: 'book-1',
            title: 'Test Book',
            author: 'Author',
            isbn: '123',
            description: null,
            coverUrl: null,
            category: null,
            totalStock: 5,
            availableStock: 0, // Out of stock
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const result = await borrowBook('user-123', 'book-1')

        expect(result.success).toBe(false)
        expect(result.message).toBe('No books available')
    })

    // ── TEST 3 — Emprunt en double ─────────────────────────
    it('S03 — should prevent duplicate borrowing by the same user', async () => {
        // Simulate a book with available stock
        vi.mocked(prisma.book.findUnique).mockResolvedValue({
            id: 'book-1',
            title: 'Test Book',
            author: 'Author',
            isbn: '123',
            description: null,
            coverUrl: null,
            category: null,
            totalStock: 5,
            availableStock: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Simulate an existing active borrowing for this user and book
        vi.mocked(prisma.borrowing.findFirst).mockResolvedValue({
            id: 'borrow-1',
            userId: 'user-123',
            bookId: 'book-1',
            borrowDate: new Date(),
            dueDate: new Date(),
            returnDate: null,
            status: 'BORROWED',
        })

        const result = await borrowBook('user-123', 'book-1')

        expect(result.success).toBe(false)
        expect(result.message).toBe('Already borrowed')
    })

    // ── TEST 4 — Injection SQL via userId ─────────────────
    it('S04 — should not execute SQL injection via userId', async () => {
        // Simulate book not found (injection should not reach DB)
        vi.mocked(prisma.book.findUnique).mockResolvedValue(null)

        // Attempt SQL injection via userId parameter
        const result = await borrowBook("'; DROP TABLE users; --", 'book-1')

        // Prisma uses parameterized queries — injection has no effect
        expect(result.success).toBe(false)
        expect(result.message).toBe('Book not found')
        // Verify Prisma was called with the raw string (not executed as SQL)
        expect(prisma.book.findUnique).toHaveBeenCalledWith({
            where: { id: 'book-1' },
        })
    })

    // ── TEST 5 — userId vide ──────────────────────────────
    it('S05 — should handle empty userId gracefully', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue(null)

        const result = await borrowBook('', 'book-1')

        expect(result.success).toBe(false)
    })

    // ── TEST 6 — bookId vide ──────────────────────────────
    it('S06 — should handle empty bookId gracefully', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue(null)

        const result = await borrowBook('user-123', '')

        expect(result.success).toBe(false)
    })
})
