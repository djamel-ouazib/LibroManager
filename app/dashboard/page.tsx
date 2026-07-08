import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserDashboardData } from './action'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    // Get current session server-side
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Redirect to login if not authenticated
    if (!session?.user?.id) redirect('/login')

    // Fetch all dashboard data in one call
    const data = await getUserDashboardData(session.user.id)

    return (
        <DashboardClient
            user={session.user}
            stats={data.stats}
            recentLoans={data.recentLoans}
            recentWishlist={data.recentWishlist}
        />
    )
}
