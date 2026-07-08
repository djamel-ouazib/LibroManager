'use client'
import { useState, useTransition } from 'react'
import { HiSearch, HiX, HiCheckCircle, HiBell } from 'react-icons/hi'
import type { Borrowing, Book, User } from '@/app/generated/prisma/client'
import { markAsReturned } from '../loans/action'

// Loan enriched with book and user details
type LoanWithDetails = Borrowing & {
    book: Book
    user: User
}

interface OverdueClientProps {
    loans: LoanWithDetails[]
}

export default function OverdueClient({
    loans: initialLoans = [],
}: OverdueClientProps) {
    // Local loans state — allows optimistic removal when marked as returned
    const [loans, setLoans] = useState<LoanWithDetails[]>(initialLoans)

    // Search input value
    const [search, setSearch] = useState<string>('')

    // Track which loan is being processed
    const [pendingId, setPendingId] = useState<string | null>(null)

    // useTransition to handle async actions without blocking UI
    const [isPending, startTransition] = useTransition()

    // Filter overdue loans based on search query
    const filteredLoans = loans.filter(
        (loan) =>
            loan.book.title.toLowerCase().includes(search.toLowerCase()) ||
            loan.user.name.toLowerCase().includes(search.toLowerCase()) ||
            loan.user.email.toLowerCase().includes(search.toLowerCase())
    )

    // Handle marking an overdue loan as returned
    function handleMarkReturned(loanId: string) {
        setPendingId(loanId)
        startTransition(async () => {
            const result = await markAsReturned(loanId)
            if (result.success) {
                // Optimistic update — remove from overdue list immediately
                setLoans((prev) => prev.filter((loan) => loan.id !== loanId))
            }
            setPendingId(null)
        })
    }

    // Calculate how many days overdue a loan is
    function daysOverdue(dueDate: Date) {
        const diff = new Date().getTime() - new Date(dueDate).getTime()
        return Math.floor(diff / (1000 * 60 * 60 * 24))
    }

    // Format date to readable string
    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const hasNoResults = filteredLoans.length === 0

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white mb-1 flex items-center gap-2">
                    Overdue Books
                    {/* Badge showing count of overdue loans */}
                    {loans.length > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-500 text-sm font-bold rounded-full">
                            {loans.length}
                        </span>
                    )}
                </h1>
                <p className="text-sm text-zinc-500">
                    Books that have not been returned by their due date
                </p>
            </div>

            {/* ── EMPTY STATE — no overdue loans ── */}
            {loans.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiBell size={32} className="mb-3 opacity-40" />
                    <p className="text-sm font-medium">No overdue books</p>
                    <p className="text-xs mt-1 text-zinc-300">
                        All loans are on time
                    </p>
                </div>
            )}

            {/* ── SEARCH BAR — only shown when there are overdue loans ── */}
            {loans.length > 0 && (
                <div className="relative mb-6 w-full max-w-md">
                    {/* Search icon — decorative, non-interactive */}
                    <HiSearch
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by book, member name or email..."
                        className="
                            w-full pl-9 pr-9 py-2 text-sm
                            border border-zinc-300 dark:border-zinc-700
                            rounded-[7px] bg-white dark:bg-neutral-900
                            dark:text-zinc-100 placeholder:text-zinc-400
                            focus:outline-none focus:ring-1 focus:ring-zinc-400
                            transition-all duration-150
                        "
                    />
                    {/* Clear search button */}
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                            <HiX size={14} />
                        </button>
                    )}
                </div>
            )}

            {/* ── NO SEARCH RESULTS ── */}
            {loans.length > 0 && hasNoResults && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiSearch size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">No results found</p>
                    <button
                        onClick={() => setSearch('')}
                        className="mt-3 text-xs underline hover:text-zinc-600"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* ── OVERDUE LOANS TABLE ── */}
            {!hasNoResults && loans.length > 0 && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-zinc-50 dark:bg-neutral-800 border-b border-zinc-200 dark:border-zinc-700">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Book
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Member
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Due Date
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Days Overdue
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.map((loan) => (
                                <tr
                                    key={loan.id}
                                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-colors duration-100"
                                >
                                    {/* Book title and author */}
                                    <td className="px-4 py-3">
                                        <p className="font-medium dark:text-white">
                                            {loan.book.title}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {loan.book.author}
                                        </p>
                                    </td>

                                    {/* Member name and email */}
                                    <td className="px-4 py-3">
                                        <p className="font-medium dark:text-white">
                                            {loan.user.name}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {loan.user.email}
                                        </p>
                                    </td>

                                    {/* Due date — always red since it's overdue */}
                                    <td className="px-4 py-3 text-red-500 font-medium">
                                        {formatDate(loan.dueDate)}
                                    </td>

                                    {/* Days overdue badge — darker red after 14 days */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`
                                            px-2 py-1 rounded-full text-xs font-bold
                                            ${
                                                daysOverdue(loan.dueDate) > 14
                                                    ? 'bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                                    : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'
                                            }
                                        `}
                                        >
                                            {daysOverdue(loan.dueDate)} day
                                            {daysOverdue(loan.dueDate) > 1
                                                ? 's'
                                                : ''}
                                        </span>
                                    </td>

                                    {/* Mark as returned action */}
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() =>
                                                handleMarkReturned(loan.id)
                                            }
                                            disabled={
                                                isPending &&
                                                pendingId === loan.id
                                            }
                                            className="
                                                flex items-center gap-1 px-2 py-1
                                                text-xs font-medium rounded-[7px]
                                                bg-emerald-50 text-emerald-600
                                                dark:bg-emerald-900/20 dark:text-emerald-400
                                                hover:bg-emerald-100 dark:hover:bg-emerald-900/40
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                transition-colors duration-150
                                            "
                                        >
                                            <HiCheckCircle size={12} />
                                            {isPending && pendingId === loan.id
                                                ? '...'
                                                : 'Mark Returned'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
