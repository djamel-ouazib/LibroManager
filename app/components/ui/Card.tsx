'use client'
import { Book } from '@/app/generated/prisma/client'
import { useState, useTransition } from 'react'
import { HiHeart, HiBookOpen } from 'react-icons/hi'
import DetailsBook from '../detailsBooks'
import { authClient } from '@/lib/auth-client'

type Props = {
    book: Book
    // Initial wishlist state passed from parent
    isWishlisted?: boolean
}

export default function Card({ book, isWishlisted = false }: Props) {
    // Controls the book detail modal visibility
    const [showBook, setShowBook] = useState<boolean>(false)

    // Local wishlist state — optimistic UI update
    const [wishlisted, setWishlisted] = useState<boolean>(isWishlisted)

    // useTransition to avoid blocking UI during wishlist toggle
    const [isPending, startTransition] = useTransition()

    // Get current user session to pass userId to wishlist actions
    const { data: session } = authClient.useSession()

    // Handle wishlist heart button click
    function handleWishlist(e: React.MouseEvent) {
        // Prevent card click from opening the modal
        e.stopPropagation()

        if (!session?.user?.id) return

        // Optimistic update — toggle immediately before server responds
        setWishlisted((prev) => !prev)

        startTransition(async () => {
            if (wishlisted) {
                // Dynamically import to avoid circular deps
                const { removeFromWishlist } = await import(
                    '@/app/dashboard/wishlist/action'
                )
                await removeFromWishlist(session.user.id, book.id)
            } else {
                const { addToWishlist } = await import(
                    '@/app/dashboard/wishlist/action'
                )
                await addToWishlist(session.user.id, book.id)
            }
        })
    }

    return (
        <>
            {/* Book detail modal */}
            <DetailsBook
                showBook={showBook}
                setShowBook={setShowBook}
                book={book}
            />

            {/* Card container */}
            <div
                onClick={() => setShowBook(true)}
                className="relative w-50 h-75 border cursor-pointer border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden flex flex-col"
            >
                {/* ── BOOK COVER ── */}
                {book?.coverUrl ? (
                    <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    // Fallback when no cover is available
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2 bg-zinc-50 dark:bg-zinc-800">
                        <HiBookOpen size={24} className="opacity-40" />
                        <p className="text-xs">No cover</p>
                    </div>
                )}

                {/* ── WISHLIST HEART BUTTON — top right corner ── */}
                <button
                    onClick={handleWishlist}
                    disabled={isPending}
                    className={`
                        absolute top-2 right-2
                        w-8 h-8 rounded-full
                        flex items-center justify-center
                        backdrop-blur-sm
                        border border-white/20
                        transition-all duration-150
                        disabled:opacity-50
                        ${
                            wishlisted
                                ? 'bg-red-500 text-white shadow-md'
                                : 'bg-white/80 dark:bg-black/50 text-zinc-400 hover:text-red-400'
                        }
                    `}
                >
                    <HiHeart size={14} />
                </button>

                {/* ── BOOK INFO ── */}
                <div className="p-1 text-sm">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {book.author}
                    </p>
                    <p className="font-semibold mb-1 dark:text-white">
                        {book.title}
                    </p>

                    {/* Available stock badge */}
                    {book.availableStock > 0 ? (
                        <div className="flex gap-2 items-center">
                            <p className="text-zinc-500 text-xs">Available</p>
                            <p className="text-blue-500 bg-blue-50 dark:bg-blue-900/30 w-6 h-6 grid items-center text-center text-xs font-mono rounded-full">
                                {book.availableStock}
                            </p>
                        </div>
                    ) : (
                        // Out of stock label
                        <p className="text-xs text-red-400 font-medium">
                            Out of stock
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
