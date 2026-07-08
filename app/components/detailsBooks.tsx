'use client'

import { Dispatch, SetStateAction, useTransition, useState } from 'react'
import { Book } from '../generated/prisma/client'
import { borrowBook } from '../dashboard/explore/actions'
import { HiX, HiBookOpen } from 'react-icons/hi'
import { authClient } from '@/lib/auth-client'

type Props = {
    showBook: boolean
    setShowBook: Dispatch<SetStateAction<boolean>>
    book: Book
}

export default function DetailsBook({ showBook, setShowBook, book }: Props) {
    // Get current user session to pass userId to borrowBook
    const { data: session } = authClient.useSession()

    // useTransition to handle the async borrow action without blocking the UI
    const [isPending, startTransition] = useTransition()

    // Track borrow result message to show feedback to the user
    const [message, setMessage] = useState<{
        text: string
        success: boolean
    } | null>(null)

    // Don't render anything if the modal is closed
    if (!showBook) return null

    // Handle borrow button click
    function handleBorrow() {
        setMessage(null)

        // Guard: user must be logged in to borrow
        if (!session?.user?.id) {
            setMessage({
                text: 'You must be logged in to borrow a book.',
                success: false,
            })
            return
        }

        startTransition(async () => {
            const result = await borrowBook(session.user.id, book.id)
            setMessage({
                text:
                    result.message ??
                    (result.success
                        ? 'Book borrowed successfully!'
                        : 'Something went wrong.'),
                success: result.success,
            })
        })
    }

    return (
        // Full-screen overlay — clicking the backdrop closes the modal
        <div
            onClick={() => setShowBook(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
            {/* Modal card — stopPropagation prevents backdrop click from closing when clicking inside */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
                    bg-white dark:bg-neutral-900
                    border border-zinc-200 dark:border-zinc-700
                    rounded-2xl shadow-2xl
                "
            >
                {/* Close button — top right corner */}
                <button
                    onClick={() => setShowBook(false)}
                    className="
                        absolute top-4 right-4 z-10
                        flex items-center justify-center
                        w-8 h-8 rounded-full
                        bg-zinc-100 dark:bg-zinc-800
                        text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100
                        border border-zinc-200 dark:border-zinc-700
                        transition-colors duration-150
                    "
                >
                    <HiX size={14} />
                </button>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-10 mt-2">
                        {/* ── BOOK COVER ── */}
                        <div className="w-full md:w-1/3 shrink-0">
                            <div className="aspect-2/3 relative rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                                {book.coverUrl ? (
                                    <img
                                        src={book.coverUrl}
                                        alt={book.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    // Fallback when no cover image is available
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                                        <HiBookOpen
                                            size={32}
                                            className="opacity-40"
                                        />
                                        <p className="text-xs">
                                            No cover available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── BOOK DETAILS ── */}
                        <div className="flex-1 flex flex-col">
                            {/* Category badge */}
                            {book.category && (
                                <span className="self-start px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wide">
                                    {book.category}
                                </span>
                            )}

                            {/* Title and author */}
                            <h1 className="text-3xl font-black mt-4 dark:text-white leading-tight">
                                {book.title}
                            </h1>
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 mt-2">
                                by{' '}
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    {book.author}
                                </span>
                            </p>

                            {/* ISBN and availability stats */}
                            <div className="grid grid-cols-2 gap-6 mt-8 py-6 border-y border-zinc-200 dark:border-zinc-700">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wide mb-1">
                                        ISBN
                                    </p>
                                    <p className="font-mono text-sm dark:text-zinc-200">
                                        {book.isbn}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold tracking-wide mb-1">
                                        Availability
                                    </p>
                                    {/* Color changes based on stock level */}
                                    <p
                                        className={`font-bold text-sm ${book.availableStock > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                                    >
                                        {book.availableStock > 0
                                            ? `${book.availableStock} of ${book.totalStock} available`
                                            : 'Out of stock'}
                                    </p>
                                </div>
                            </div>

                            {/* Book description */}
                            <div className="mt-6">
                                <h2 className="font-bold mb-2 dark:text-white text-sm uppercase tracking-wide text-zinc-400">
                                    Summary
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                    {book.description ??
                                        'No description available.'}
                                </p>
                            </div>

                            {/* Borrow action + feedback message */}
                            <div className="mt-auto pt-8 flex flex-col gap-3">
                                {/* Feedback message shown after borrow attempt */}
                                {message && (
                                    <p
                                        className={`text-sm font-medium ${message.success ? 'text-emerald-500' : 'text-red-500'}`}
                                    >
                                        {message.text}
                                    </p>
                                )}

                                <div className="flex gap-3">
                                    {/* Borrow button — disabled when out of stock or request is pending */}
                                    <button
                                        onClick={handleBorrow}
                                        disabled={
                                            isPending ||
                                            book.availableStock <= 0
                                        }
                                        className="
                                            px-6 py-2.5 rounded-[7px] text-sm font-semibold
                                            bg-black text-white dark:bg-white dark:text-black
                                            hover:opacity-80 disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            transition-opacity duration-150
                                        "
                                    >
                                        {isPending
                                            ? 'Borrowing...'
                                            : 'Borrow Book'}
                                    </button>

                                    {/* Cancel button — closes the modal */}
                                    <button
                                        onClick={() => setShowBook(false)}
                                        className="
                                            px-6 py-2.5 rounded-[7px] text-sm font-medium
                                            border border-zinc-300 dark:border-zinc-600
                                            text-zinc-600 dark:text-zinc-300
                                            hover:bg-zinc-100 dark:hover:bg-zinc-800
                                            transition-colors duration-150
                                        "
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
