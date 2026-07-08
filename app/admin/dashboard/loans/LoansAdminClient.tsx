'use client'
import { useState, useTransition } from 'react'
import { HiSearch, HiX, HiCheckCircle, HiExclamation } from 'react-icons/hi'
import type {
    Borrowing,
    Book,
    User,
    LoanStatus,
} from '@/app/generated/prisma/client'
import { markAsReturned, markAsOverdue } from './action'

// Loan enriched with book and user details
type LoanWithDetails = Borrowing & {
    book: Book
    user: User
}

interface LoansAdminClientProps {
    loans: LoanWithDetails[]
}

export default function LoansAdminClient({
    loans: initialLoans,
}: LoansAdminClientProps) {
    // Local loans state — allows optimistic UI updates
    const [loans, setLoans] = useState<LoanWithDetails[]>(initialLoans)

    // Search input value
    const [search, setSearch] = useState<string>('')

    // Filter by loan status (null = show all)
    const [activeStatus, setActiveStatus] = useState<string | null>(null)

    // Track which loan action is pending to show loading state
    const [pendingId, setPendingId] = useState<string | null>(null)

    // useTransition to handle async actions without blocking UI
    const [isPending, startTransition] = useTransition()

    // Filter loans based on search query and active status
    const filteredLoans = loans.filter((loan) => {
        const matchesSearch =
            loan.book.title.toLowerCase().includes(search.toLowerCase()) ||
            loan.user.name.toLowerCase().includes(search.toLowerCase()) ||
            loan.user.email.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = activeStatus ? loan.status === activeStatus : true

        return matchesSearch && matchesStatus
    })

    // Handle marking a loan as returned and restoring book stock
    function handleMarkReturned(loanId: string) {
        setPendingId(loanId)
        startTransition(async () => {
            const result = await markAsReturned(loanId)
            if (result.success) {
                // Optimistic update — update status and return date locally
                setLoans((prev) =>
                    prev.map((loan) =>
                        loan.id === loanId
                            ? {
                                  ...loan,
                                  status: 'RETURNED' as LoanStatus,
                                  returnDate: new Date(),
                              }
                            : loan
                    )
                )
            }
            setPendingId(null)
        })
    }

    // Handle marking a loan as overdue
    function handleMarkOverdue(loanId: string) {
        setPendingId(loanId)
        startTransition(async () => {
            const result = await markAsOverdue(loanId)
            if (result.success) {
                // Optimistic update — update status locally
                setLoans((prev) =>
                    prev.map((loan) =>
                        loan.id === loanId
                            ? { ...loan, status: 'OVERDUE' as LoanStatus }
                            : loan
                    )
                )
            }
            setPendingId(null)
        })
    }

    // Returns color classes based on loan status
    function getStatusStyle(status: string) {
        switch (status) {
            case 'BORROWED':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            case 'RETURNED':
                return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            case 'OVERDUE':
                return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-zinc-100 text-zinc-600'
        }
    }

    // Format date to readable string
    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    const statuses = ['BORROWED', 'RETURNED', 'OVERDUE']
    const hasNoResults = filteredLoans.length === 0

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    Loan Tracking
                </h1>
                <p className="text-sm text-zinc-500">
                    {loans.length} total loan{loans.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* ── SEARCH BAR ── */}
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

            {/* ── STATUS FILTER PILLS with count ── */}
            <div className="flex flex-wrap gap-2 mb-8">
                {/* "All" pill */}
                <button
                    onClick={() => setActiveStatus(null)}
                    className={`
                        px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150
                        ${
                            activeStatus === null
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }
                    `}
                >
                    All ({loans.length})
                </button>

                {/* One pill per status with count */}
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150
                            ${
                                activeStatus === status
                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                            }
                        `}
                    >
                        {status} (
                        {loans.filter((l) => l.status === status).length})
                    </button>
                ))}
            </div>

            {/* ── NO RESULTS STATE ── */}
            {hasNoResults && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiSearch size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">No loans found</p>
                    <button
                        onClick={() => {
                            setSearch('')
                            setActiveStatus(null)
                        }}
                        className="mt-3 text-xs underline hover:text-zinc-600"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── LOANS TABLE ── */}
            {!hasNoResults && (
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
                                    Borrow Date
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Due Date
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Return Date
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                    Status
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
                                    {/* Book title */}
                                    <td className="px-4 py-3 font-medium dark:text-white max-w-37.5 truncate">
                                        {loan.book.title}
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

                                    {/* Borrow date */}
                                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                                        {formatDate(loan.borrowDate)}
                                    </td>

                                    {/* Due date — red if overdue */}
                                    <td
                                        className={`px-4 py-3 font-medium ${loan.status === 'OVERDUE' ? 'text-red-500' : 'text-zinc-500 dark:text-zinc-400'}`}
                                    >
                                        {formatDate(loan.dueDate)}
                                    </td>

                                    {/* Return date — dash if not returned yet */}
                                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                                        {loan.returnDate
                                            ? formatDate(loan.returnDate)
                                            : '—'}
                                    </td>

                                    {/* Status badge */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(loan.status)}`}
                                        >
                                            {loan.status}
                                        </span>
                                    </td>

                                    {/* Action buttons */}
                                    <td className="px-4 py-3">
                                        {loan.status === 'BORROWED' ||
                                        loan.status === 'OVERDUE' ? (
                                            <div className="flex gap-2">
                                                {/* Mark as returned — available for BORROWED and OVERDUE */}
                                                <button
                                                    onClick={() =>
                                                        handleMarkReturned(
                                                            loan.id
                                                        )
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
                                                    {isPending &&
                                                    pendingId === loan.id
                                                        ? '...'
                                                        : 'Returned'}
                                                </button>

                                                {/* Mark as overdue — only for BORROWED loans */}
                                                {loan.status === 'BORROWED' && (
                                                    <button
                                                        onClick={() =>
                                                            handleMarkOverdue(
                                                                loan.id
                                                            )
                                                        }
                                                        disabled={
                                                            isPending &&
                                                            pendingId ===
                                                                loan.id
                                                        }
                                                        className="
                                                            flex items-center gap-1 px-2 py-1
                                                            text-xs font-medium rounded-[7px]
                                                            bg-red-50 text-red-500
                                                            dark:bg-red-900/20 dark:text-red-400
                                                            hover:bg-red-100 dark:hover:bg-red-900/40
                                                            disabled:opacity-50 disabled:cursor-not-allowed
                                                            transition-colors duration-150
                                                        "
                                                    >
                                                        <HiExclamation
                                                            size={12}
                                                        />
                                                        {isPending &&
                                                        pendingId === loan.id
                                                            ? '...'
                                                            : 'Overdue'}
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            // No actions available for returned loans
                                            <span className="text-xs text-zinc-300 dark:text-zinc-600">
                                                —
                                            </span>
                                        )}
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
