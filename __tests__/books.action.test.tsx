import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
    createBook,
    getBookById,
    updateBook,
} from '@/app/admin/dashboard/books/action'

import deletBook from '@/app/admin/dashboard/books/action'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
    default: {
        book: {
            create: vi.fn(),
            findUnique: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
        },
    },
}))

// Mock Next cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}))

// Mock redirect
vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

describe('Book Server Actions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create a book successfully', async () => {
        // Fake form data
        const formData = new FormData()

        formData.append('title', 'Atomic Habits')
        formData.append('author', 'James Clear')
        formData.append('category', 'Development')
        formData.append('isbn', '123456')
        formData.append('totalStock', '10')
        formData.append('coverUrl', 'cover.jpg')
        formData.append('description', 'Book description')

        // Mock Prisma create
        vi.mocked(prisma.book.create).mockResolvedValue({} as any)

        const result = await createBook(null, formData)

        expect(prisma.book.create).toHaveBeenCalled()

        expect(result).toEqual({
            success: true,
        })

        expect(revalidatePath).toHaveBeenCalledWith('/admin/dashboard/books')
    })

    it('should throw error when required fields are missing', async () => {
        const formData = new FormData()

        formData.append('title', '')

        await expect(createBook(null, formData)).rejects.toThrow(
            'Missing fields'
        )

        expect(prisma.book.create).not.toHaveBeenCalled()
    })

    it('should return a book by id', async () => {
        const book = {
            id: '1',
            title: 'Clean Code',
        }

        vi.mocked(prisma.book.findUnique).mockResolvedValue(book as any)

        const result = await getBookById('1')

        expect(prisma.book.findUnique).toHaveBeenCalledWith({
            where: {
                id: '1',
            },
        })

        expect(result).toEqual(book)
    })

    it('should return null when getBookById fails', async () => {
        vi.mocked(prisma.book.findUnique).mockRejectedValue(
            new Error('Database error')
        )

        const result = await getBookById('1')

        expect(result).toBeNull()
    })

    it('should update a book successfully', async () => {
        vi.mocked(prisma.book.update).mockResolvedValue({} as any)

        const result = await updateBook('1', {
            title: 'Updated Book',
            author: 'Author',
            category: 'Programming',
            totalStock: 20,
            description: 'New description',
            coverUrl: 'new-cover.jpg',
        })

        expect(prisma.book.update).toHaveBeenCalledWith({
            where: {
                id: '1',
            },
            data: {
                title: 'Updated Book',
                author: 'Author',
                category: 'Programming',
                totalStock: 20,
                description: 'New description',
                coverUrl: 'new-cover.jpg',
            },
        })

        expect(revalidatePath).toHaveBeenCalled()
    })

    it('should delete a book and redirect', async () => {
        vi.mocked(prisma.book.delete).mockResolvedValue({} as any)

        await deletBook('1')

        expect(prisma.book.delete).toHaveBeenCalledWith({
            where: {
                id: '1',
            },
        })

        expect(revalidatePath).toHaveBeenCalledWith('/admin/dashboard/books')

        expect(redirect).toHaveBeenCalledWith('/admin/dashboard/books')
    })
})
