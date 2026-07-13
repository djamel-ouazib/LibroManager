import { getAllBooks, getCategories } from './actions'
import { getUserWishlist } from '../wishlist/action'
import ExploreClient from './ExploreClient'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Explore() {
    // Get current session server-side to fetch user wishlist
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Fetch books, categories and wishlist in parallel for better performance
    const [books, categories, wishlist] = await Promise.all([
        getAllBooks(),
        getCategories(),
        // If not logged in, return empty wishlist
        session?.user?.id
            ? getUserWishlist(session.user.id)
            : Promise.resolve([]),
    ])

    // Extract only the bookIds for easy lookup in the client component
    const wishlistIds = wishlist.map((w) => w.bookId)

    return (
        // Pass server data down to the client component
        <ExploreClient
            books={books}
            categories={categories}
            wishlistIds={wishlistIds}
        />
    )
}
