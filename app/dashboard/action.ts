'use server'
import prisma from '@/lib/prisma'

// Fetch all stats and recent data for the user dashboard
export async function getUserDashboardData(userId: string) {
    const [
        activeBorrowings,
        returnedBorrowings,
        overdueBorrowings,
        wishlistCount,
        recentLoans,
        recentWishlist,
    ] = await Promise.all([
        // Count active borrowings
        prisma.borrowing.count({
            where: { userId, status: 'BORROWED' },
        }),
        // Count returned borrowings
        prisma.borrowing.count({
            where: { userId, status: 'RETURNED' },
        }),
        // Count overdue borrowings
        prisma.borrowing.count({
            where: { userId, status: 'OVERDUE' },
        }),
        // Count wishlist items
        prisma.wishlist.count({
            where: { userId },
        }),
        // Fetch 3 most recent active loans with book details
        prisma.borrowing.findMany({
            where: { userId, status: 'BORROWED' },
            include: { book: true },
            orderBy: { borrowDate: 'desc' },
            take: 3,
        }),
        // Fetch 3 most recently wishlisted books
        prisma.wishlist.findMany({
            where: { userId },
            include: { book: true },
            orderBy: { createdAt: 'desc' },
            take: 3,
        }),
    ])

    return {
        stats: {
            activeBorrowings,
            returnedBorrowings,
            overdueBorrowings,
            wishlistCount,
        },
        recentLoans,
        recentWishlist,
    }
}
