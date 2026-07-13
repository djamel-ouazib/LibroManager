import Link from 'next/link'
import { useEffect, useState } from 'react'

// Type representing a book returned by the /api/books endpoint
interface Book {
    id: string
    title: string
    author: string
    category: string | null
    totalStock: number
    availableStock: number
}

// Table component — fetches and displays the list of books from the API
export default function Table() {
    // List of books fetched from the API
    const [books, setBooks] = useState<Book[]>([])

    // Loading state while fetching
    const [loading, setLoading] = useState(false)

    // Fetch all books from the REST API on mount
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/books')
                const data: Book[] = await res.json()
                setBooks(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [])

    return (
        <div>
            {loading ? (
                // Loading spinner — shown while fetching books
                <div className="flex items-center justify-center min-h-screen w-full py-5">
                    <div className="w-6 h-6 relative">
                        <div className="absolute inset-0 rounded-full border-2 border-zinc-200"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-t-gray-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    </div>
                </div>
            ) : (
                <div className="mt-8">
                    {/* ── TABLE HEADER ── */}
                    <div className="grid grid-cols-5 py-2 font-bold border-b p-1">
                        <p>Author</p>
                        <p>Title</p>
                        <p>Category</p>
                        <p>Total Stock</p>
                        <p>Available Stock</p>
                    </div>

                    {/* ── TABLE ROWS — each row links to the book detail page ── */}
                    {books.map((book) => (
                        <Link
                            key={book.id}
                            href={`/admin/dashboard/books/${book.id}`}
                            className="block group"
                        >
                            <div className="grid grid-cols-5 py-4 px-2 border-b border-zinc-50 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-zinc-600 dark:text-zinc-400 text-sm items-center">
                                {/* Author — slightly bolder for visual hierarchy */}
                                <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate pr-4">
                                    {book.author}
                                </p>

                                {/* Title — italic for book aesthetic */}
                                <p className="truncate pr-4 italic">
                                    {book.title}
                                </p>

                                {/* Category — uppercase small caps style */}
                                <p className="text-xs uppercase tracking-wider">
                                    {book.category}
                                </p>

                                {/* Total stock count */}
                                <p className="text-center md:text-left">
                                    {book.totalStock}
                                </p>

                                {/* Available stock — green if available, red if out of stock */}
                                <p
                                    className={`font-bold ${book.availableStock > 0 ? 'text-emerald-600' : 'text-red-500'}`}
                                >
                                    {book.availableStock}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
