import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
    // Get current session server-side
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Redirect to login if not authenticated
    if (!session?.user?.id) redirect('/login')

    return <SettingsClient user={session.user} />
}
