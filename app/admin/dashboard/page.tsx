import { getAdminDashboardData } from './action'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
    // Fetch all dashboard data server-side
    const data = await getAdminDashboardData()

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            <AdminDashboardClient
                stats={data.stats}
                recentLoans={data.recentLoans}
                recentMembers={data.recentMembers}
            />
        </div>
    )
}
