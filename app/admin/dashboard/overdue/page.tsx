import { getOverdueLoans, markAsReturned } from '../loans/action'

// Admin page — displays all overdue loans with days overdue badge
export default async function OverduePage() {
    // Fetch all loans with OVERDUE status from the database
    const overdueLoans = await getOverdueLoans()

    return (
        <div className="p-6 w-full h-screen overflow-y-auto dark:bg-black">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    Overdue Books
                </h1>
                <p className="text-sm text-zinc-500">
                    {overdueLoans.length} book
                    {overdueLoans.length !== 1 ? 's' : ''} currently overdue
                </p>
            </div>

            {/* ── EMPTY STATE ── */}
            {overdueLoans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <p className="text-sm">No overdue books — all good!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {overdueLoans.map((loan) => {
                        // Calculate number of days overdue
                        const daysOverdue = Math.floor(
                            (new Date().getTime() -
                                new Date(loan.dueDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                        )

                        return (
                            <div
                                key={loan.id}
                                className="
                                    flex items-center gap-4 p-4
                                    bg-white dark:bg-neutral-900
                                    border border-zinc-200 dark:border-zinc-700
                                    rounded-xl
                                "
                            >
                                {/* ── BOOK AND USER INFO ── */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium dark:text-white truncate">
                                        {loan.book.title}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {loan.book.author}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        {loan.user.name} — {loan.user.email}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5">
                                        Due:{' '}
                                        {new Date(
                                            loan.dueDate
                                        ).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>

                                {/* ── DAYS OVERDUE BADGE ── */}
                                {/* Badge pulses red when overdue by more than 14 days */}
                                <span
                                    className={`
                                    shrink-0 px-3 py-1 rounded-full text-xs font-bold
                                    ${
                                        daysOverdue > 14
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse'
                                            : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                                    }
                                `}
                                >
                                    {daysOverdue} day
                                    {daysOverdue !== 1 ? 's' : ''} overdue
                                </span>

                                {/* ── MARK AS RETURNED — inline Server Action ── */}
                                <form
                                    action={async () => {
                                        'use server'
                                        await markAsReturned(loan.id)
                                    }}
                                >
                                    <button
                                        type="submit"
                                        className="
                                            shrink-0 px-3 py-1 text-xs font-medium
                                            bg-emerald-100 text-emerald-600
                                            dark:bg-emerald-900/30 dark:text-emerald-400
                                            rounded-lg hover:bg-emerald-200
                                            dark:hover:bg-emerald-900/50
                                            transition-colors duration-150
                                        "
                                    >
                                        Mark Returned
                                    </button>
                                </form>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
