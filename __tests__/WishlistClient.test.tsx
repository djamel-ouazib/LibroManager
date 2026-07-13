import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import WishlistClient from '@/app/dashboard/wishlist/WishlistClient'

import { removeFromWishlist } from '@/app/dashboard/wishlist/action'
import { borrowBook } from '@/app/dashboard/explore/actions'

vi.mock('@/app/dashboard/wishlist/action', () => ({
    removeFromWishlist: vi.fn(),
}))

vi.mock('@/app/dashboard/explore/actions', () => ({
    borrowBook: vi.fn(),
}))

const mockWishlist = [
    {
        id: 'wishlist-1',
        userId: 'user-1',
        bookId: 'book-1',
        book: {
            id: 'book-1',
            title: 'Clean Code',
            author: 'Robert Martin',
            category: 'Programming',
            availableStock: 5,
            coverUrl: '',
            isbn: '123',
            totalStock: 10,
            description: '',
        },
    },
]

describe('WishlistClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should display wishlist books', () => {
        render(
            <WishlistClient wishlist={mockWishlist as any} userId="user-1" />
        )

        expect(screen.getByText('Clean Code')).toBeInTheDocument()

        expect(screen.getByText('Robert Martin')).toBeInTheDocument()
    })

    it('should filter books by search', () => {
        render(
            <WishlistClient wishlist={mockWishlist as any} userId="user-1" />
        )

        const input = screen.getByPlaceholderText(
            'Search by title or author...'
        )

        fireEvent.change(input, {
            target: {
                value: 'Clean',
            },
        })

        expect(screen.getByText('Clean Code')).toBeInTheDocument()
    })

    it('should remove book from wishlist', async () => {
        vi.mocked(removeFromWishlist).mockResolvedValue({
            success: true,
        } as any)

        render(
            <WishlistClient wishlist={mockWishlist as any} userId="user-1" />
        )

        const removeButton = screen.getAllByRole('button').at(-1)

        fireEvent.click(removeButton!)

        await waitFor(() => {
            expect(removeFromWishlist).toHaveBeenCalledWith('user-1', 'book-1')
        })

        expect(screen.queryByText('Clean Code')).not.toBeInTheDocument()
    })

    it('should borrow a book successfully', async () => {
        vi.mocked(borrowBook).mockResolvedValue({
            success: true,
            message: 'Borrowed successfully!',
        } as any)

        render(
            <WishlistClient wishlist={mockWishlist as any} userId="user-1" />
        )

        const borrowButton = screen.getByText('Borrow')

        fireEvent.click(borrowButton)

        await waitFor(() => {
            expect(borrowBook).toHaveBeenCalledWith('user-1', 'book-1')
        })

        expect(screen.getByText('Borrowed successfully!')).toBeInTheDocument()
    })
})
