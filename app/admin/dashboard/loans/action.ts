'use server'
import prisma from '@/lib/prisma'

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

// Mark a loan as returned and update book stock
export async function markAsReturned(loanId: string) {
    try {
        const loan = await prisma.borrowing.findUnique({
            where: { id: loanId },
        })

        if (!loan) return { success: false, message: 'Loan not found' }
        if (loan.status === 'RETURNED')
            return { success: false, message: 'Already returned' }

        // Update loan status and increment stock atomically
        await prisma.$transaction(async (tx) => {
            await tx.borrowing.update({
                where: { id: loanId },
                data: {
                    status: 'RETURNED',
                    returnDate: new Date(),
                },
            })

            // Give the book back to stock
            await tx.book.update({
                where: { id: loan.bookId },
                data: {
                    availableStock: { increment: 1 },
                },
            })
        })

        return { success: true, message: 'Marked as returned' }
    } catch (error) {
        return { success: false, message: 'Server error' }
    }
}

// Mark a loan as overdue
export async function markAsOverdue(loanId: string) {
    try {
        await prisma.borrowing.update({
            where: { id: loanId },
            data: { status: 'OVERDUE' },
        })
        return { success: true, message: 'Marked as overdue' }
    } catch (error) {
        return { success: false, message: 'Server error' }
    }
}
