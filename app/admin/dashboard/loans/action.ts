'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Fetch all loans with book and user details
export async function getAllLoans() {
    const loans = await prisma.borrowing.findMany({
        include: {
            book: true,
            user: true,
        },
        orderBy: {
            borrowDate: 'desc',
        },
    })
    return loans
}

// Fetch all overdue loans for the Overdue Books admin page
export async function getOverdueLoans() {
    try {
        const loans = await prisma.borrowing.findMany({
            where: { status: 'OVERDUE' },
            include: { book: true, user: true },
            orderBy: { dueDate: 'asc' },
        })
        return loans
    } catch (error) {
        console.error('Error fetching overdue loans:', error)
        return []
    }
}

// Mark a loan as returned and update book stock atomically
export async function markAsReturned(loanId: string) {
    try {
        // Check loan exists before updating
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
                data: {
                    status: 'RETURNED',
                    returnDate: new Date(),
                },
            })
            await tx.book.update({
                where: { id: loan.bookId },
                data: {
                    availableStock: { increment: 1 },
                },
            })
        })

        revalidatePath('/admin/dashboard/loans')
        return { success: true, message: 'Marked as returned' }
    } catch (error) {
        console.error('Error marking as returned:', error)
        return { success: false, message: 'Server error' }
    }
}

// Mark a loan as overdue — checks existence first
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
        return { success: true, message: 'Marked as overdue' }
    } catch (error) {
        console.error('Error marking as overdue:', error)
        return { success: false, message: 'Server error' }
    }
}
