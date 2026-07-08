import { getUserWishlist } from './action'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import WishlistClient from './WishlistClient'

export default async function WishlistPage() {
    // Get current session server-side
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Redirect to login if not authenticated
    if (!session?.user?.id) redirect('/login')

    // Fetch only this user's wishlist
    const wishlist = await getUserWishlist(session.user.id)

    return <WishlistClient wishlist={wishlist} userId={session.user.id} />
}
