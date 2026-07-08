'use client'
import { useState, useMemo } from 'react'
import { HiSearch, HiX, HiBookOpen } from 'react-icons/hi'
import type { Borrowing, Book } from '@/app/generated/prisma/client'

// Borrowing enriched with book details
type LoanWithBook = Borrowing & {
    book: Book
}

interface LoansClientProps {
    loans: LoanWithBook[]
}

export default function LoansClient({ loans }: LoansClientProps) {
    // Search input value
    const [search, setSearch] = useState<string>('')

    // Filter by loan status (null = show all)
    const [activeStatus, setActiveStatus] = useState<string | null>(null)

    // Filter loans based on search query and status
    const filteredLoans = useMemo(() => {
        return loans.filter((loan) => {
            // Match against book title or author
            const matchesSearch =
                loan.book.title.toLowerCase().includes(search.toLowerCase()) ||
                loan.book.author.toLowerCase().includes(search.toLowerCase())

            // Match against selected status, or allow all
            const matchesStatus = activeStatus
                ? loan.status === activeStatus
                : true

            return matchesSearch && matchesStatus
        })
    }, [loans, search, activeStatus])

    // Returns the right color classes based on loan status
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
                    My Loans
                </h1>
                <p className="text-sm text-zinc-500">
                    Track all your current and past borrowings
                </p>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="relative mb-6 w-full max-w-md">
                <HiSearch
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by book title or author..."
                    className="
                        w-full pl-9 pr-9 py-2 text-sm
                        border border-zinc-300 dark:border-zinc-700
                        rounded-[7px] bg-white dark:bg-neutral-900
                        dark:text-zinc-100 placeholder:text-zinc-400
                        focus:outline-none focus:ring-1 focus:ring-zinc-400
                        dark:focus:ring-zinc-600
                        transition-all duration-150
                    "
                />
                {/* Clear search button */}
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <HiX size={14} />
                    </button>
                )}
            </div>

            {/* ── STATUS FILTER PILLS ── */}
            <div className="flex flex-wrap gap-2 mb-8">
                {/* "All" pill — resets the status filter */}
                <button
                    onClick={() => setActiveStatus(null)}
                    className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        transition-colors duration-150
                        ${
                            activeStatus === null
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }
                    `}
                >
                    All
                </button>

                {/* One pill per status */}
                {statuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => setActiveStatus(status)}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            transition-colors duration-150
                            ${
                                activeStatus === status
                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                            }
                        `}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* ── EMPTY STATE — no loans at all ── */}
            {loans.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiBookOpen size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">
                        You haven't borrowed any books yet
                    </p>
                </div>
            )}

            {/* ── NO RESULTS STATE — search or filter returned nothing ── */}
            {loans.length > 0 && hasNoResults && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiSearch size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">No loans match your search</p>
                    <button
                        onClick={() => {
                            setSearch('')
                            setActiveStatus(null)
                        }}
                        className="mt-3 text-xs underline hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── LOANS CARDS ── card layout instead of table for user-facing UI */}
            {!hasNoResults && (
                <div className="flex flex-col gap-3">
                    {filteredLoans.map((loan) => (
                        <div
                            key={loan.id}
                            className="
                                flex items-center gap-4 p-4
                                bg-white dark:bg-neutral-900
                                border border-zinc-200 dark:border-zinc-700
                                rounded-xl
                            "
                        >
                            {/* Book cover thumbnail */}
                            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                {loan.book.coverUrl ? (
                                    <img
                                        src={loan.book.coverUrl}
                                        alt={loan.book.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    // Fallback icon when no cover is available
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                        <HiBookOpen size={16} />
                                    </div>
                                )}
                            </div>

                            {/* Book info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-medium dark:text-white truncate">
                                    {loan.book.title}
                                </p>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    {loan.book.author}
                                </p>
                                <div className="flex gap-4 mt-2 text-xs text-zinc-400">
                                    {/* Borrow date */}
                                    <span>
                                        Borrowed: {formatDate(loan.borrowDate)}
                                    </span>
                                    {/* Due date — red if overdue */}
                                    <span
                                        className={
                                            loan.status === 'OVERDUE'
                                                ? 'text-red-500 font-medium'
                                                : ''
                                        }
                                    >
                                        Due: {formatDate(loan.dueDate)}
                                    </span>
                                    {/* Return date — only shown if returned */}
                                    {loan.returnDate && (
                                        <span className="text-emerald-500">
                                            Returned:{' '}
                                            {formatDate(loan.returnDate)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status badge */}
                            <span
                                className={`
                                shrink-0 px-2 py-1 rounded-full text-xs font-bold uppercase
                                ${getStatusStyle(loan.status)}
                            `}
                            >
                                {loan.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
