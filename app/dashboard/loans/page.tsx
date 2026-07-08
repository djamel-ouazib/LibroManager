import { getUserLoans } from './action'
import LoansClient from './LoansClient'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LoansPage() {
    // Get current session server-side
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    // Redirect to login if not authenticated
    if (!session?.user?.id) redirect('/login')

    // Fetch only this user's loans
    const loans = await getUserLoans(session.user.id)

    return <LoansClient loans={loans} />
}
