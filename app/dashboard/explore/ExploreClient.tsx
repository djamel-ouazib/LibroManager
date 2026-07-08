'use client'
import { useState, useMemo } from 'react'
import Card from '@/app/components/ui/Card'
import { HiSearch, HiX } from 'react-icons/hi'
import type { Book } from '@/app/generated/prisma/client'

// Props using the real Prisma Book type
interface ExploreClientProps {
    books: Book[]
    categories: string[]
}

export default function ExploreClient({
    books,
    categories,
}: ExploreClientProps) {
    // Search input value
    const [search, setSearch] = useState<string>('')

    // Currently selected category filter (null = show all)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // Filter books based on search query and active category
    const filteredBooks = useMemo(() => {
        return books.filter((book) => {
            // Match against title or author
            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase())

            // Match against selected category, or allow all if none selected
            const matchesCategory = activeCategory
                ? book.category === activeCategory
                : true

            return matchesSearch && matchesCategory
        })
    }, [books, search, activeCategory])

    // Group filtered books by category
    const groupedBooks = useMemo(() => {
        return categories.reduce<Record<string, Book[]>>((acc, category) => {
            const booksInCategory = filteredBooks.filter(
                (book) => book.category === category
            )
            // Only include categories with at least one matching book
            if (booksInCategory.length > 0) {
                acc[category] = booksInCategory
            }
            return acc
        }, {})
    }, [filteredBooks, categories])

    // True when no books match the current filters
    const hasNoResults = Object.keys(groupedBooks).length === 0

    return (
        <div className="p-6 dark:bg-black w-full h-screen overflow-y-auto">
            {/* ── PAGE HEADER ── */}
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold dark:text-white mb-1">
                    Explore
                </h1>
                <p className="text-sm text-zinc-500">
                    Browse and search through the library collection
                </p>
            </div>

            {/* ── SEARCH BAR — centered with mx-auto ── */}
            <div className="relative mb-6 w-full max-w-md mx-auto">
                {/* Search icon — non-interactive, decorative */}
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
                {/* Clear button — only shown when search has a value */}
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <HiX size={14} />
                    </button>
                )}
            </div>

            {/* ── CATEGORY FILTER PILLS — centered with justify-center ── */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {/* "All" pill — resets the active category filter */}
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        transition-colors duration-150
                        ${
                            activeCategory === null
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }
                    `}
                >
                    All
                </button>

                {/* One pill per category fetched from the database */}
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            transition-colors duration-150
                            ${
                                activeCategory === category
                                    ? 'bg-black text-white dark:bg-white dark:text-black'
                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                            }
                        `}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* ── NO RESULTS STATE ── */}
            {hasNoResults && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <HiSearch size={32} className="mb-3 opacity-40" />
                    <p className="text-sm">
                        No books found for{' '}
                        <span className="font-medium">"{search}"</span>
                    </p>
                    {/* Reset all active filters */}
                    <button
                        onClick={() => {
                            setSearch('')
                            setActiveCategory(null)
                        }}
                        className="mt-3 text-xs underline hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* ── BOOKS GROUPED BY CATEGORY ── */}
            {Object.entries(groupedBooks).map(([category, booksInCategory]) => (
                <div key={category} className="mb-8">
                    {/* Category title with book count */}
                    <div className="flex items-center gap-2 mb-3">
                        <h2 className="text-lg font-medium dark:text-white">
                            {category}
                        </h2>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {booksInCategory.length} book
                            {booksInCategory.length > 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Books grid */}
                    <div className="flex flex-wrap gap-3">
                        {booksInCategory.map((book) => (
                            <Card key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
