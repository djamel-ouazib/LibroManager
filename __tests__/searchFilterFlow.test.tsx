import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ExploreClient from '../app/dashboard/explore/ExploreClient'
import type { Book } from '../app/generated/prisma/client'

// ── MOCKS ─────────────────────────────────────────────────

// Mock authenticated user session
vi.mock('../../lib/auth-client', () => ({
    authClient: {
        useSession: () => ({
            data: { user: { id: 'user-123', name: 'Djamel' } },
        }),
    },
}))

// Mock wishlist and borrow actions
vi.mock('../../app/dashboard/wishlist/action', () => ({
    addToWishlist: vi.fn().mockResolvedValue({ success: true }),
    removeFromWishlist: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('../../app/dashboard/explore/actions', () => ({
    borrowBook: vi.fn().mockResolvedValue({ success: true }),
}))

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}))

// ── MOCK DATA ─────────────────────────────────────────────

const makeBook = (
    id: string,
    title: string,
    author: string,
    category: string
): Book => ({
    id,
    title,
    author,
    isbn: `isbn-${id}`,
    description: null,
    coverUrl: null,
    category,
    totalStock: 5,
    availableStock: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
})

const mockBooks: Book[] = [
    makeBook('1', 'Clean Code', 'Robert Martin', 'Technology'),
    makeBook('2', 'The Pragmatic Programmer', 'David Thomas', 'Technology'),
    makeBook('3', 'Sapiens', 'Yuval Noah Harari', 'History'),
    makeBook('4', 'Atomic Habits', 'James Clear', 'Self-development'),
]

const categories = ['Technology', 'History', 'Self-development']

// ── INTEGRATION TESTS — SEARCH & FILTER FLOW ─────────────

describe('Integration — Search and Filter Flow', () => {
    // ── TEST SF01 — All books visible by default ──────────
    it('SF01 — all books are displayed when no filter is applied', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        // All 4 book titles must be visible
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.getByText('Sapiens')).toBeInTheDocument()
        expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
    })

    // ── TEST SF02 — Search by title ───────────────────────
    it('SF02 — searching by title filters books correctly', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'clean' } })

        // Only "Clean Code" should remain
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.queryByText('Sapiens')).not.toBeInTheDocument()
        expect(screen.queryByText('Atomic Habits')).not.toBeInTheDocument()
    })

    // ── TEST SF03 — Search by author ──────────────────────
    it('SF03 — searching by author filters books correctly', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'James Clear' } })

        // Only "Atomic Habits" should be visible
        expect(screen.getByText('Atomic Habits')).toBeInTheDocument()
        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()
        expect(screen.queryByText('Sapiens')).not.toBeInTheDocument()
    })

    // ── TEST SF04 — Filter by category ───────────────────
    it('SF04 — filtering by category shows only matching books', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        // Click on "History" category pill
        fireEvent.click(screen.getByRole('button', { name: 'History' }))

        // Only "Sapiens" should be visible
        expect(screen.getByText('Sapiens')).toBeInTheDocument()
        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()
        expect(screen.queryByText('Atomic Habits')).not.toBeInTheDocument()
    })

    // ── TEST SF05 — No results state ──────────────────────
    it('SF05 — searching with no match shows empty state', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        const searchInput = screen.getByPlaceholderText(/search/i)
        fireEvent.change(searchInput, { target: { value: 'zzzzz' } })

        // No books should be visible
        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()
        expect(screen.queryByText('Sapiens')).not.toBeInTheDocument()
    })

    // ── TEST SF06 — Reset filter with All button ──────────
    it('SF06 — clicking All resets the category filter', () => {
        render(
            <ExploreClient
                books={mockBooks}
                categories={categories}
                wishlistIds={[]}
            />
        )

        // First filter by History
        fireEvent.click(screen.getByRole('button', { name: 'History' }))
        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()

        // Then click "All" to reset
        fireEvent.click(screen.getByRole('button', { name: 'All' }))

        // All books must be visible again
        expect(screen.getByText('Clean Code')).toBeInTheDocument()
        expect(screen.getByText('Sapiens')).toBeInTheDocument()
    })
})
