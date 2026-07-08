'use server'
import prisma from '@/lib/prisma'

// Fetch all data needed for the admin dashboard
export async function getAdminDashboardData() {
    const [
        totalBooks,
        activeBorrowings,
        newMembers,
        overdueBooks,
        totalMembers,
        recentLoans,
        recentMembers,
    ] = await Promise.all([
        // Total books in the library
        prisma.book.count(),

        // Currently borrowed books
        prisma.borrowing.count({ where: { status: 'BORROWED' } }),

        // New members this month
        prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                    ),
                },
                role: 'USER',
            },
        }),

        // Overdue books
        prisma.borrowing.count({ where: { status: 'OVERDUE' } }),

        // Total members
        prisma.user.count({ where: { role: 'USER' } }),

        // 5 most recent loans with book and user details
        prisma.borrowing.findMany({
            take: 5,
            orderBy: { borrowDate: 'desc' },
            include: { book: true, user: true },
        }),

        // 5 most recently registered members
        prisma.user.findMany({
            where: { role: 'USER' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                status: true,
            },
        }),
    ])

    return {
        stats: {
            totalBooks,
            activeBorrowings,
            newMembers,
            overdueBooks,
            totalMembers,
        },
        recentLoans,
        recentMembers,
    }
}
