'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Fetch all loans for a specific user
export async function getUserLoans(userId: string) {
    const loans = await prisma.borrowing.findMany({
        where: { userId },
        include: { book: true },
        orderBy: { borrowDate: 'desc' },
    })
    return loans
}

// Mark a loan as returned and increment book stock
export async function markAsReturned(loanId: string) {
    try {
        // Check loan exists
        const loan = await prisma.borrowing.findUnique({
            where: { id: loanId },
        })
        if (!loan) return { success: false, message: 'Loan not found' }
        if (loan.status === 'RETURNED')
            return { success: false, message: 'Already returned' }

        // Atomic transaction: update status + increment stock
        await prisma.$transaction(async (tx) => {
            await tx.borrowing.update({
                where: { id: loanId },
                data: { status: 'RETURNED', returnDate: new Date() },
            })
            await tx.book.update({
                where: { id: loan.bookId },
                data: { availableStock: { increment: 1 } },
            })
        })

        revalidatePath('/admin/dashboard/loans')
        return { success: true }
    } catch (error) {
        console.error('Error marking as returned:', error)
        return { success: false, message: 'Server error' }
    }
}

// Mark a loan as overdue
export async function markAsOverdue(loanId: string) {
    try {
        // Check loan exists before updating
        const loan = await prisma.borrowing.findUnique({
            where: { id: loanId },
        })
        if (!loan) return { success: false, message: 'Loan not found' }

        await prisma.borrowing.update({
            where: { id: loanId },
            data: { status: 'OVERDUE' },
        })

        revalidatePath('/admin/dashboard/loans')
        return { success: true }
    } catch (error) {
        console.error('Error marking as overdue:', error)
        return { success: false, message: 'Server error' }
    }
}
