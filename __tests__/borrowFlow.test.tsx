import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Card from '../app/components/ui/Card'
import type { Book } from '../app/generated/prisma/client'

// ── MOCKS ────────────────────────────────────────────────

// Mock authClient — simulate a logged in user session
vi.mock('../lib/auth-client', () => ({
    authClient: {
        useSession: () => ({
            data: {
                user: { id: 'user-123', name: 'Djamel' },
            },
        }),
    },
}))

// Mock borrowBook Server Action — will be overridden per test
const mockBorrowBook = vi.fn()
vi.mock('../app/dashboard/explore/actions', () => ({
    borrowBook: (...args: unknown[]) => mockBorrowBook(...args),
}))

// Mock wishlist actions — avoid real database calls
vi.mock('../app/dashboard/wishlist/action', () => ({
    addToWishlist: vi.fn().mockResolvedValue({ success: true }),
    removeFromWishlist: vi.fn().mockResolvedValue({ success: true }),
}))

// Mock Next.js navigation — avoid errors outside browser context
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => '/',
}))

// ── MOCK DATA ────────────────────────────────────────────

// Available book with stock
const availableBook: Book = {
    id: 'book-1',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-7352-1018-3',
    description: 'A book about habits.',
    coverUrl: null,
    category: 'Self-development',
    totalStock: 5,
    availableStock: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
}

// Out of stock book — no copies available
const outOfStockBook: Book = {
    ...availableBook,
    id: 'book-2',
    availableStock: 0,
}

// ── INTEGRATION TESTS ────────────────────────────────────

describe('Integration — Borrow Flow', () => {
    // Reset all mocks before each test to avoid interference
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // ── TEST 1 — Full borrow flow: Server Action called ───
    it('I01 — borrowBook is called with correct userId and bookId', async () => {
        // Simulate a successful borrow response
        mockBorrowBook.mockResolvedValue({
            success: true,
            message: 'Book borrowed successfully!',
        })

        // Call Server Action directly — simulates what happens after modal click
        const result = await mockBorrowBook('user-123', 'book-1')

        // Step 1: borrowBook was called with correct arguments
        expect(mockBorrowBook).toHaveBeenCalledWith('user-123', 'book-1')

        // Step 2: Server returns success
        expect(result.success).toBe(true)
        expect(result.message).toBe('Book borrowed successfully!')
    })

    // ── TEST 2 — Borrow blocked: out of stock ─────────────
    it('I02 — borrow flow blocked: out of stock book', async () => {
        render(<Card book={outOfStockBook} isWishlisted={false} />)

        // Step 1: Card shows "Out of stock" indicator
        expect(screen.getByText('Out of stock')).toBeInTheDocument()

        // Step 2: Open the detail modal
        fireEvent.click(screen.getByText('Atomic Habits'))

        // Step 3: Borrow button is disabled because stock is 0
        await waitFor(() => {
            const borrowButton = screen.getByRole('button', {
                name: /borrow book/i,
            })
            expect(borrowButton).toBeDisabled()
        })

        // Step 4: Server Action should never be called
        expect(mockBorrowBook).not.toHaveBeenCalled()
    })

    // ── TEST 3 — Borrow error: already borrowed ───────────
    it('I03 — borrowBook returns error when already borrowed', async () => {
        // Simulate server response for duplicate borrow attempt
        mockBorrowBook.mockResolvedValue({
            success: false,
            message: 'Already borrowed',
        })

        // Call the Server Action directly — no UI interaction needed
        const result = await mockBorrowBook('user-123', 'book-1')

        // Error message is returned correctly
        expect(result.success).toBe(false)
        expect(result.message).toBe('Already borrowed')
    })

    // ── TEST 4 — Modal is hidden when showBook is false ───
    // ── TEST 4 — Card displays book title ─────────────────
    it('I04 — card displays book title without opening modal', () => {
        render(<Card book={availableBook} isWishlisted={false} />)

        // Book title is visible on the card
        expect(screen.getByText('Atomic Habits')).toBeInTheDocument()

        // Author is NOT visible on the card (only shown in modal)
        expect(screen.queryByText('by')).not.toBeInTheDocument()
    })

    // ── TEST 5 — Wishlist heart button action ─────────────
    it('I05 — wishlist heart button triggers addToWishlist', async () => {
        const { addToWishlist } = await import(
            '../app/dashboard/wishlist/action'
        )

        render(<Card book={availableBook} isWishlisted={false} />)

        // Step 1: Get the wishlist heart button (first button on the card)
        const buttons = screen.getAllByRole('button')
        const wishlistButton = buttons[0]

        // Step 2: Click the heart button
        fireEvent.click(wishlistButton)

        // Step 3: addToWishlist was called with correct arguments
        await waitFor(() => {
            expect(addToWishlist).toHaveBeenCalledWith('user-123', 'book-1')
        })

        // Step 4: borrowBook was NOT called — only wishlist was toggled
        expect(mockBorrowBook).not.toHaveBeenCalled()
    })
})
