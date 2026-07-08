import { getAllLoans } from './action'
import LoansAdminClient from './LoansAdminClient'

export default async function AdminLoansPage() {
    // Fetch all loans server-side
    const loans = await getAllLoans()

    return <LoansAdminClient loans={loans} />
}
