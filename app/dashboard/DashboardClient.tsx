'use client'
import Link from 'next/link'
import {
    HiBookOpen,
    HiHeart,
    HiCheckCircle,
    HiExclamation,
    HiClock,
} from 'react-icons/hi'
import type { Borrowing, Wishlist, Book } from '@/app/generated/prisma/client'

// Types enriched with related book details
type LoanWithBook = Borrowing & { book: Book }
type WishlistWithBook = Wishlist & { book: Book }

// Stats shape passed from the server component
interface Stats {
    activeBorrowings: number
    returnedBorrowings: number
    overdueBorrowings: number
    wishlistCount: number
}

// Props for the dashboard client component
interface DashboardClientProps {
    user: { name: string; email: string; image?: string | null }
    stats: Stats
    recentLoans: LoanWithBook[]
    recentWishlist: WishlistWithBook[]
}

export default function DashboardClient({
    user,
    stats,
    recentLoans,
    recentWishlist,
}: DashboardClientProps) {
    // Format a date to a human-readable string (e.g. "13 Jul 2026")
    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Stat cards configuration — each card shows a key metric
    const statCards = [
        {
            label: 'Active Loans',
            value: stats.activeBorrowings,
            icon: <HiBookOpen size={20} />,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: 'Returned',
            value: stats.returnedBorrowings,
            icon: <HiCheckCircle size={20} />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        },
        {
            label: 'Overdue',
            value: stats.overdueBorrowings,
            icon: <HiExclamation size={20} />,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            label: 'Wishlist',
            value: stats.wishlistCount,
            icon: <HiHeart size={20} />,
            color: 'text-pink-500',
            bg: 'bg-pink-50 dark:bg-pink-900/20',
        },
    ]

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── WELCOME HEADER ── personalized greeting using first name */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white">
                    Welcome back, {user.name.split(' ')[0]} 👋
                </h1>
                {/* Escaped apostrophe to avoid ESLint react/no-unescaped-entities error */}
                <p className="text-sm text-zinc-500 mt-1">
                    Here&apos;s what&apos;s happening with your library activity
                </p>
            </div>

            {/* ── STATS CARDS ── grid of 4 key metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className="
                            p-4 rounded-xl
                            bg-white dark:bg-neutral-900
                            border border-zinc-200 dark:border-zinc-700
                            flex flex-col gap-3
                        "
                    >
                        {/* Colored icon badge */}
                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}
                        >
                            {stat.icon}
                        </div>

                        {/* Numeric value and label */}
                        <div>
                            <p className="text-2xl font-bold dark:text-white">
                                {stat.value}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── BOTTOM SECTION ── recent loans and wishlist side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── RECENT ACTIVE LOANS ── shows the 3 most recent active loans */}
                <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold dark:text-white">
                            Active Loans
                        </h2>
                        <Link
                            href="/dashboard/loans"
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
                        >
                            View all
                        </Link>
                    </div>

                    {/* Empty state when no active loans exist */}
                    {recentLoans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                            <HiBookOpen size={24} className="mb-2 opacity-40" />
                            <p className="text-xs">No active loans</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-center gap-3"
                                >
                                    {/* Book cover thumbnail with fallback icon */}
                                    <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                        {loan.book.coverUrl ? (
                                            <img
                                                src={loan.book.coverUrl}
                                                alt={loan.book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <HiBookOpen size={14} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book title, author and due date */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium dark:text-white truncate">
                                            {loan.book.title}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {loan.book.author}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <HiClock
                                                size={10}
                                                className="text-zinc-400"
                                            />
                                            <p className="text-xs text-zinc-400">
                                                Due {formatDate(loan.dueDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Overdue badge — only shown when status is OVERDUE */}
                                    {loan.status === 'OVERDUE' && (
                                        <span className="shrink-0 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold rounded-full">
                                            Overdue
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RECENT WISHLIST ── shows the 3 most recently saved books */}
                <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold dark:text-white">
                            Wishlist
                        </h2>
                        <Link
                            href="/dashboard/wishlist"
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
                        >
                            View all
                        </Link>
                    </div>

                    {/* Empty state when wishlist is empty */}
                    {recentWishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                            <HiHeart size={24} className="mb-2 opacity-40" />
                            <p className="text-xs">Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentWishlist.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                                    {/* Book cover thumbnail with fallback icon */}
                                    <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                        {item.book.coverUrl ? (
                                            <img
                                                src={item.book.coverUrl}
                                                alt={item.book.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                <HiBookOpen size={14} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book title, author and category badge */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium dark:text-white truncate">
                                            {item.book.title}
                                        </p>
                                        <p className="text-xs text-zinc-400">
                                            {item.book.author}
                                        </p>
                                        {item.book.category && (
                                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 text-xs rounded-full">
                                                {item.book.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Availability indicator — green if available, red if not */}
                                    <span
                                        className={`shrink-0 text-xs font-medium ${item.book.availableStock > 0 ? 'text-emerald-500' : 'text-red-400'}`}
                                    >
                                        {item.book.availableStock > 0
                                            ? 'Available'
                                            : 'Unavailable'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
