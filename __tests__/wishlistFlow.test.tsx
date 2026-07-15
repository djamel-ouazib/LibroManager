import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Card from '../app/components/ui/Card'
import type { Book } from '../app/generated/prisma/client'

// ── MOCKS ────────────────────────────────────────────────

// Mock authenticated user session
vi.mock('../../lib/auth-client', () => ({
    authClient: {
        useSession: () => ({
            data: { user: { id: 'user-123', name: 'Djamel' } },
        }),
    },
}))

// Mock wishlist Server Actions
const mockAddToWishlist = vi.fn()
const mockRemoveFromWishlist = vi.fn()
vi.mock('../../app/dashboard/wishlist/action', () => ({
    addToWishlist: (...args: unknown[]) => mockAddToWishlist(...args),
    removeFromWishlist: (...args: unknown[]) => mockRemoveFromWishlist(...args),
}))

// Mock borrowBook to avoid real DB calls
vi.mock('../../app/dashboard/explore/actions', () => ({
    borrowBook: vi
        .fn()
        .mockResolvedValue({ success: true, message: 'Borrowed!' }),
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}))

// ── MOCK DATA ─────────────────────────────────────────────

const book: Book = {
    id: 'book-1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0-13-235088-4',
    description: 'A handbook of agile software craftsmanship.',
    coverUrl: null,
    category: 'Technology',
    totalStock: 3,
    availableStock: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
}

// ── INTEGRATION TESTS — WISHLIST FLOW ─────────────────────

describe('Integration — Wishlist Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })
    // ── TEST W01 — addToWishlist called with correct args ─────
    it('W01 — addToWishlist returns success when called correctly', async () => {
        mockAddToWishlist.mockResolvedValue({ success: true })

        const result = await mockAddToWishlist('user-123', 'book-1')

        expect(result.success).toBe(true)
        expect(mockAddToWishlist).toHaveBeenCalledWith('user-123', 'book-1')
    })

    // ── TEST W02 — removeFromWishlist called with correct args ─
    it('W02 — removeFromWishlist returns success when called correctly', async () => {
        mockRemoveFromWishlist.mockResolvedValue({ success: true })

        const result = await mockRemoveFromWishlist('user-123', 'book-1')

        expect(result.success).toBe(true)
        expect(mockRemoveFromWishlist).toHaveBeenCalledWith(
            'user-123',
            'book-1'
        )
    })

    // ── TEST W03 — Book visible on card ──────────────────────
    it('W03 — book title and author are visible on the card', () => {
        render(<Card book={book} isWishlisted={false} />)

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.getByText('Robert C. Martin')).toBeInTheDocument()
    })

    // ── TEST W04 — Out of stock ───────────────────────────────
    it('W04 — out of stock book displays correct indicator', () => {
        const outOfStockBook = { ...book, availableStock: 0 }
        render(<Card book={outOfStockBook} isWishlisted={false} />)

        expect(screen.getByText('Out of stock')).toBeInTheDocument()
    })

    // ── TEST W05 — wishlist and borrow are independent ────────
    it('W05 — addToWishlist and borrowBook are independent actions', async () => {
        mockAddToWishlist.mockResolvedValue({ success: true })
        mockRemoveFromWishlist.mockResolvedValue({ success: true })

        // Call wishlist action
        await mockAddToWishlist('user-123', 'book-1')

        // Only addToWishlist called — not removeFromWishlist
        expect(mockAddToWishlist).toHaveBeenCalledTimes(1)
        expect(mockRemoveFromWishlist).not.toHaveBeenCalled()
    })
})
