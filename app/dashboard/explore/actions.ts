'use server'

import { Prisma } from '@/app/generated/prisma/client'
import prisma from '@/lib/prisma'

// Fetch all books from the database
export async function getAllBooks() {
    const books = await prisma.book.findMany()
    return books
}

// Extract unique non-null categories dynamically from all books
export async function getCategories() {
    const books = await prisma.book.findMany({
        select: { category: true },
    })
    // Filter out null values and remove duplicates using Set
    return [
        ...new Set(
            books
                .map((book) => book.category)
                .filter((cat): cat is string => cat !== null)
        ),
    ]
}

// Borrow a book for a user — handles stock check, duplicate check, and transaction
export async function borrowBook(userId: string, bookId: string) {
    try {
        // Check if the book exists
        const book = await prisma.book.findUnique({
            where: { id: bookId },
        })

        if (!book) {
            return {
                success: false,
                message: 'Book not found',
            }
        }

        // Check if stock is available
        if (book.availableStock <= 0) {
            return {
                success: false,
                message: 'No books available',
            }
        }

        // Prevent duplicate borrowing
        const existingBorrow = await prisma.borrowing.findFirst({
            where: {
                userId,
                bookId,
                status: 'BORROWED',
            },
        })

        if (existingBorrow) {
            return {
                success: false,
                message: 'Already borrowed',
            }
        }

        // Set due date to 14 days from today
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 14)

        // Create borrowing record and decrement stock atomically
        const borrowing = await prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                const createdBorrow = await tx.borrowing.create({
                    data: {
                        userId,
                        bookId,
                        dueDate,
                    },
                })

                await tx.book.update({
                    where: { id: bookId },
                    data: {
                        availableStock: {
                            decrement: 1,
                        },
                    },
                })

                return createdBorrow
            }
        )

        return {
            success: true,
            borrowing,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            message: 'Server error',
        }
    }
}
