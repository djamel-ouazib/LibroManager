'use server'
import prisma from '@/lib/prisma'

// Fetch all loans for a specific user
export async function getUserLoans(userId: string) {
    const loans = await prisma.borrowing.findMany({
        where: {
            userId: userId,
        },
        include: {
            // Include book details to display in the UI
            book: true,
        },
        orderBy: {
            borrowDate: 'desc',
        },
    })
    return loans
}
