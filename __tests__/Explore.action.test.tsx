import { describe, it, expect, vi, beforeEach } from 'vitest'

import prisma from '@/lib/prisma'
import {
    borrowBook,
    getAllBooks,
    getCategories,
} from '@/app/dashboard/explore/actions'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        book: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
        },
        borrowing: {
            findFirst: vi.fn(),
            create: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}))

describe('Books Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Test getAllBooks action
    it('should return all books', async () => {
        const mockBooks = [
            {
                id: '1',
                title: 'Clean Code',
                author: 'Robert Martin',
            },
        ]

        vi.mocked(prisma.book.findMany).mockResolvedValue(mockBooks as any)

        const result = await getAllBooks()

        expect(result).toEqual(mockBooks)

        expect(prisma.book.findMany).toHaveBeenCalledOnce()
    })

    // Test categories extraction
    it('should return unique categories without null values', async () => {
        vi.mocked(prisma.book.findMany).mockResolvedValue([
            {
                category: 'Programming',
            },
            {
                category: 'Fantasy',
            },
            {
                category: 'Programming',
            },
            {
                category: null,
            },
        ] as any)

        const result = await getCategories()

        expect(result).toEqual(['Programming', 'Fantasy'])
    })

    // Test borrow when book does not exist
    it('should return error if book does not exist', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue(null)

        const result = await borrowBook('user-1', 'book-1')

        expect(result).toEqual({
            success: false,
            message: 'Book not found',
        })
    })

    // Test borrow when stock is empty
    it('should return error when no stock available', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue({
            id: 'book-1',
            availableStock: 0,
        } as any)

        const result = await borrowBook('user-1', 'book-1')

        expect(result).toEqual({
            success: false,
            message: 'No books available',
        })
    })

    // Test duplicate borrowing prevention
    it('should prevent duplicate borrowing', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue({
            id: 'book-1',
            availableStock: 2,
        } as any)

        vi.mocked(prisma.borrowing.findFirst).mockResolvedValue({
            id: 'borrow-1',
        } as any)

        const result = await borrowBook('user-1', 'book-1')

        expect(result).toEqual({
            success: false,
            message: 'Already borrowed',
        })
    })

    // Test successful borrowing
    it('should borrow a book successfully', async () => {
        vi.mocked(prisma.book.findUnique).mockResolvedValue({
            id: 'book-1',
            availableStock: 5,
        } as any)

        vi.mocked(prisma.borrowing.findFirst).mockResolvedValue(null)

        const mockBorrow = {
            id: 'borrow-1',
            userId: 'user-1',
            bookId: 'book-1',
        }

        vi.mocked(prisma.$transaction).mockImplementation(
            async (callback: any) => {
                return callback({
                    borrowing: {
                        create: vi.fn().mockResolvedValue(mockBorrow),
                    },

                    book: {
                        update: vi.fn().mockResolvedValue(true),
                    },
                })
            }
        )

        const result = await borrowBook('user-1', 'book-1')

        expect(result.success).toBe(true)

        expect(result.borrowing).toEqual(mockBorrow)
    })
})
