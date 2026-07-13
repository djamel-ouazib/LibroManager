import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
} from '@/app/dashboard/wishlist/action'

import prisma from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
    default: {
        wishlist: {
            create: vi.fn(),
            deleteMany: vi.fn(),
            findMany: vi.fn(),
        },
    },
}))

describe('Wishlist server actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should add a book to wishlist successfully', async () => {
        vi.mocked(prisma.wishlist.create).mockResolvedValue({
            id: 'wishlist-1',
            userId: 'user-1',
            bookId: 'book-1',
        } as any)

        const result = await addToWishlist('user-1', 'book-1')

        expect(prisma.wishlist.create).toHaveBeenCalledWith({
            data: {
                userId: 'user-1',
                bookId: 'book-1',
            },
        })

        expect(result).toEqual({
            success: true,
        })
    })

    it('should return error when book already exists', async () => {
        vi.mocked(prisma.wishlist.create).mockRejectedValue(
            new Error('Unique constraint')
        )

        const result = await addToWishlist('user-1', 'book-1')

        expect(result).toEqual({
            success: false,
            message: 'Already in wishlist',
        })
    })

    it('should remove a book from wishlist', async () => {
        vi.mocked(prisma.wishlist.deleteMany).mockResolvedValue({
            count: 1,
        } as any)

        const result = await removeFromWishlist('user-1', 'book-1')

        expect(prisma.wishlist.deleteMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
                bookId: 'book-1',
            },
        })

        expect(result).toEqual({
            success: true,
        })
    })

    it('should return user wishlist', async () => {
        const wishlistMock = [
            {
                id: 'wishlist-1',
                userId: 'user-1',
                bookId: 'book-1',
                book: {
                    title: 'Clean Code',
                    author: 'Robert Martin',
                },
            },
        ]

        vi.mocked(prisma.wishlist.findMany).mockResolvedValue(
            wishlistMock as any
        )

        const result = await getUserWishlist('user-1')

        expect(prisma.wishlist.findMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
            },
            include: {
                book: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        expect(result).toEqual(wishlistMock)
    })
})
