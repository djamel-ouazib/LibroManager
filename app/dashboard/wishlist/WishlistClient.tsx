'use client'
import { useState, useTransition } from 'react'
import { HiHeart, HiBookOpen, HiSearch, HiX } from 'react-icons/hi'
import type { Wishlist, Book } from '@/app/generated/prisma/client'
import { removeFromWishlist } from './action'
import { borrowBook } from '../explore/actions'

// Wishlist item enriched with book details
type WishlistWithBook = Wishlist & {
    book: Book
}

interface WishlistClientProps {
    wishlist: WishlistWithBook[]
    userId: string
}

export default function WishlistClient({
    wishlist,
    userId,
}: WishlistClientProps) {
    // Local wishlist state — allows optimistic removal without page refresh
    const [items, setItems] = useState<WishlistWithBook[]>(wishlist)

    // Search input value
    const [search, setSearch] = useState<string>('')

    // useTransition to handle async removal without blocking UI
    const [isPending, startTransition] = useTransition()

    // Track borrow feedback message per book id
    const [borrowMessages, setBorrowMessages] = useState<
        Record<string, { text: string; success: boolean }>
    >({})

    // Track which book is currently being borrowed
    const [borrowPending, setBorrowPending] = useState<string | null>(null)

    // Filter wishlist based on search query (title or author)
    const filteredItems = items.filter(
        (item) =>
            item.book.title.toLowerCase().includes(search.toLowerCase()) ||
            item.book.author.toLowerCase().includes(search.toLowerCase())
    )

    // Remove a book from the wishlist with optimistic UI update
    function handleRemove(bookId: string) {
        // Optimistic update — remove immediately before server responds
        setItems((prev) => prev.filter((item) => item.bookId !== bookId))

        startTransition(async () => {
            await removeFromWishlist(userId, bookId)
        })
    }

    // Handle borrow action directly from the wishlist
    async function handleBorrow(bookId: string) {
        if (!userId) return

        // Mark this book as pending to show loading state
        setBorrowPending(bookId)
        const result = await borrowBook(userId, bookId)
        setBorrowPending(null)

        // Store feedback message for this specific book
        setBorrowMessages((prev) => ({
            ...prev,
            [bookId]: {
                text:
                    result.message ??
                    (result.success
                        ? 'Borrowed successfully!'
                        : 'Something went wrong.'),
                success: result.success,
            },
        }))
    }

    const hasNoResults = filteredItems.length === 0

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    My Wishlist
                </h1>
                <p className="text-sm text-zinc-500">
                    {items.length} book{items.length !== 1 ? 's' : ''} saved
                </p>
            </div>

            {/* ── SEARCH BAR — only shown if wishlist is not empty ── */}
            {items.length > 0 && (
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
                        placeholder="Search by title or author..."
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
            )}

            {/* ── EMPTY STATE — no books in wishlist at all ── */}
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiHeart size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">Your wishlist is empty</p>
                    <p className="text-xs mt-1 text-zinc-300">
                        Browse the library and add books you like
                    </p>
                </div>
            )}

            {/* ── NO SEARCH RESULTS ── */}
            {items.length > 0 && hasNoResults && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiSearch size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">No books match your search</p>
                    <button
                        onClick={() => setSearch('')}
                        className="mt-3 text-xs underline hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {/* ── WISHLIST CARDS ── */}
            {!hasNoResults && (
                <div className="flex flex-col gap-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="
                                flex items-center gap-4 p-4
                                bg-white dark:bg-neutral-900
                                border border-zinc-200 dark:border-zinc-700
                                rounded-xl
                                transition-opacity duration-150
                            "
                        >
                            {/* Book cover thumbnail */}
                            <div className="w-12 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                {item.book.coverUrl ? (
                                    <img
                                        src={item.book.coverUrl}
                                        alt={item.book.title}
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
                                    {item.book.title}
                                </p>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    {item.book.author}
                                </p>
                                {/* Category badge */}
                                {item.book.category && (
                                    <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 text-xs rounded-full">
                                        {item.book.category}
                                    </span>
                                )}

                                {/* Borrow feedback message for this book */}
                                {borrowMessages[item.bookId] && (
                                    <p
                                        className={`text-xs font-medium mt-1 ${borrowMessages[item.bookId].success ? 'text-emerald-500' : 'text-red-500'}`}
                                    >
                                        {borrowMessages[item.bookId].text}
                                    </p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="text-center shrink-0">
                                {item.book.availableStock > 0 ? (
                                    <span className="text-xs text-emerald-500 font-medium">
                                        Available
                                    </span>
                                ) : (
                                    <span className="text-xs text-red-400 font-medium">
                                        Out of stock
                                    </span>
                                )}
                            </div>

                            {/* Borrow button — disabled when out of stock or request is pending */}
                            <button
                                onClick={() => handleBorrow(item.bookId)}
                                disabled={
                                    borrowPending === item.bookId ||
                                    item.book.availableStock <= 0
                                }
                                className="
                                    shrink-0 px-3 py-1.5 rounded-[7px] text-xs font-semibold
                                    bg-black text-white dark:bg-white dark:text-black
                                    hover:opacity-80 disabled:opacity-40
                                    disabled:cursor-not-allowed
                                    transition-opacity duration-150
                                "
                            >
                                {/* Show loading text while borrowing is in progress */}
                                {borrowPending === item.bookId
                                    ? 'Borrowing...'
                                    : 'Borrow'}
                            </button>

                            {/* Remove from wishlist button */}
                            <button
                                onClick={() => handleRemove(item.bookId)}
                                disabled={isPending}
                                className="
                                    shrink-0 w-8 h-8 rounded-full
                                    flex items-center justify-center
                                    bg-red-50 dark:bg-red-900/20
                                    text-red-400 hover:text-red-600 hover:bg-red-100
                                    dark:hover:bg-red-900/40
                                    transition-colors duration-150
                                    disabled:opacity-50
                                "
                            >
                                <HiHeart size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
