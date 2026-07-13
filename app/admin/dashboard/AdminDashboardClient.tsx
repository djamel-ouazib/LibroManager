'use client'
import Link from 'next/link'
import {
    HiBookOpen,
    HiUsers,
    HiClock,
    HiExclamation,
    HiCheckCircle,
    HiCollection,
} from 'react-icons/hi'
import type { Borrowing, Book, User } from '@/app/generated/prisma/client'

// Types enriched with relations
type LoanWithDetails = Borrowing & { book: Book; user: User }
type MemberPreview = Pick<
    User,
    'id' | 'name' | 'email' | 'createdAt' | 'status'
>

interface Stats {
    totalBooks: number
    activeBorrowings: number
    newMembers: number
    overdueBooks: number
    totalMembers: number
}

interface AdminDashboardClientProps {
    stats: Stats
    recentLoans: LoanWithDetails[]
    recentMembers: MemberPreview[]
}

export default function AdminDashboardClient({
    stats,
    recentLoans,
    recentMembers,
}: AdminDashboardClientProps) {
    // Format date to readable string
    function formatDate(date: Date) {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })
    }

    // Returns status color classes
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

    // Stat cards config
    const statCards = [
        {
            label: 'Total Books',
            value: stats.totalBooks,
            icon: <HiCollection size={20} />,
            color: 'text-violet-500',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            href: '/admin/dashboard/books',
        },
        {
            label: 'Total Members',
            value: stats.totalMembers,
            icon: <HiUsers size={20} />,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            href: '/admin/dashboard/users',
        },
        {
            label: 'Active Loans',
            value: stats.activeBorrowings,
            icon: <HiClock size={20} />,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            href: '/admin/dashboard/loans',
        },
        {
            label: 'Overdue Books',
            value: stats.overdueBooks,
            icon: <HiExclamation size={20} />,
            color: 'text-red-500',
            bg: 'bg-red-50 dark:bg-red-900/20',
            href: '/admin/dashboard/overdue',
        },
        {
            label: 'New Members This Month',
            value: stats.newMembers,
            icon: <HiCheckCircle size={20} />,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            href: '/admin/dashboard/users',
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            {/* ── PAGE HEADER ── */}
            <div>
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    Admin Dashboard
                </h1>
                <p className="text-sm text-zinc-500">
                    Overview of the library activity
                </p>
            </div>

            {/* ── STATS CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="
                            p-4 rounded-xl
                            bg-white dark:bg-neutral-900
                            border border-zinc-200 dark:border-zinc-700
                            flex flex-col gap-3
                            hover:shadow-md transition-shadow duration-150
                        "
                    >
                        {/* Icon */}
                        <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}
                        >
                            {stat.icon}
                        </div>

                        {/* Value and label */}
                        <div>
                            <p
                                className={`text-2xl font-bold ${stat.label === 'Overdue Books' && stats.overdueBooks > 0 ? 'text-red-500 animate-pulse' : 'dark:text-white'}`}
                            >
                                {stat.value}
                            </p>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* ── BOTTOM SECTION ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── RECENT LOANS ── */}
                <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold dark:text-white">
                            Recent Loans
                        </h2>
                        <Link
                            href="/admin/dashboard/loans"
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
                        >
                            View all
                        </Link>
                    </div>

                    {/* Empty state */}
                    {recentLoans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                            <HiBookOpen size={24} className="mb-2 opacity-40" />
                            <p className="text-xs">No loans yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentLoans.map((loan) => (
                                <div
                                    key={loan.id}
                                    className="flex items-center gap-3"
                                >
                                    {/* Book cover thumbnail */}
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

                                    {/* Loan info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium dark:text-white truncate">
                                            {loan.book.title}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate">
                                            {loan.user.name} ·{' '}
                                            {formatDate(loan.borrowDate)}
                                        </p>
                                    </div>

                                    {/* Loan status badge */}
                                    <span
                                        className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusStyle(loan.status)}`}
                                    >
                                        {loan.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RECENT MEMBERS ── */}
                <div className="bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold dark:text-white">
                            Recent Members
                        </h2>
                        <Link
                            href="/admin/dashboard/users"
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
                        >
                            View all
                        </Link>
                    </div>

                    {/* Empty state */}
                    {recentMembers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                            <HiUsers size={24} className="mb-2 opacity-40" />
                            <p className="text-xs">No members yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {recentMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3"
                                >
                                    {/* Member avatar — initials fallback */}
                                    <div className="w-9 h-9 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                                        <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                            {member.name
                                                ?.charAt(0)
                                                .toUpperCase() ?? '?'}
                                        </span>
                                    </div>

                                    {/* Member info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium dark:text-white truncate">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate">
                                            {member.email}
                                        </p>
                                    </div>

                                    {/* Member status badge */}
                                    <span
                                        className={`
                                        shrink-0 px-2 py-0.5 rounded-full text-xs font-bold uppercase
                                        ${
                                            member.status === 'ACTIVE'
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : member.status === 'BANNED'
                                                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                  : 'bg-zinc-100 text-zinc-600'
                                        }
                                    `}
                                    >
                                        {member.status}
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
