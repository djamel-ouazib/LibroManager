'use server'
import prisma from '@/lib/prisma'

// Add a book to the user's wishlist
export async function addToWishlist(userId: string, bookId: string) {
    try {
        await prisma.wishlist.create({
            data: { userId, bookId },
        })
        return { success: true }
    } catch (error) {
        // @@unique constraint — book already in wishlist
        return { success: false, message: 'Already in wishlist' }
    }
}

// Remove a book from the user's wishlist
export async function removeFromWishlist(userId: string, bookId: string) {
    try {
        await prisma.wishlist.deleteMany({
            where: { userId, bookId },
        })
        return { success: true }
    } catch (error) {
        return { success: false, message: 'Server error' }
    }
}

// Fetch all wishlist items for a specific user with book details
export async function getUserWishlist(userId: string) {
    const wishlist = await prisma.wishlist.findMany({
        where: { userId },
        include: {
            book: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })
    return wishlist
}
